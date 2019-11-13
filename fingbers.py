from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from object_detection.utils import ops as utils_ops
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as vis_util
from collections import defaultdict
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
from io import BytesIO
import re
import base64
from time import sleep
from queue import Queue
import threading
import eventlet
eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'momochacha'
socketio = SocketIO(app, async_mode='eventlet')

q = Queue(maxsize=3)
PATH_TO_FROZEN_GRAPH = "output_inference_graph/frozen_inference_graph.pb"
PATH_TO_LABEL = "annotations/object_detection.pbtxt"
# Define all the classes
CLASSES = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "0"]

detection_graph = tf.Graph()
with detection_graph.as_default():
    od_graph_def = tf.compat.v1.GraphDef()
    with tf.io.gfile.GFile(PATH_TO_FROZEN_GRAPH, 'rb') as fid:
        serialized_graph = fid.read()
        od_graph_def.ParseFromString(serialized_graph)
        tf.import_graph_def(od_graph_def, name='')

    sess = tf.Session(graph=detection_graph)
    ops = tf.get_default_graph().get_operations()
    all_tensor_names = {output.name for op in ops for output in op.outputs}
    tensor_dict = {}
	
    for key in [
        'num_detections', 'detection_boxes', 'detection_scores',
          'detection_classes', 'detection_masks'
    ]:
        tensor_name = key + ':0'
        if tensor_name in all_tensor_names:
          tensor_dict[key] = tf.get_default_graph().get_tensor_by_name(
              tensor_name)
    if 'detection_masks' in tensor_dict:
        detection_boxes = tf.squeeze(tensor_dict['detection_boxes'], [0])
        detection_masks = tf.squeeze(tensor_dict['detection_masks'], [0])
        real_num_detection = tf.cast(tensor_dict['num_detections'][0], tf.int32)
        detection_boxes = tf.slice(detection_boxes, [0, 0], [real_num_detection, -1])
        detection_masks = tf.slice(detection_masks, [0, 0, 0], [real_num_detection, -1, -1])
        detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
            detection_masks, detection_boxes, image.shape[1], image.shape[2])
        detection_masks_reframed = tf.cast(
            tf.greater(detection_masks_reframed, 0.5), tf.uint8)
        tensor_dict['detection_masks'] = tf.expand_dims(
            detection_masks_reframed, 0)
    image_tensor = tf.get_default_graph().get_tensor_by_name('image_tensor:0')
    # print(tf.contrib.graph_editor.get_tensors(tf.get_default_graph()))

label_map = label_map_util.load_labelmap(PATH_TO_LABEL)
categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=11)
categories_index = label_map_util.create_category_index(categories)

def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape(
        (im_width, im_height, 3)).astype(np.uint8)

def run_inference(image):

      output_dict = sess.run(tensor_dict,
                             feed_dict={image_tensor: image})

      # all outputs are float32 numpy arrays, so convert types as appropriate
      output_dict['num_detections'] = int(output_dict['num_detections'][0])
      output_dict['detection_classes'] = output_dict[
          'detection_classes'][0].astype(np.int64)
      output_dict['detection_boxes'] = output_dict['detection_boxes'][0]
      output_dict['detection_scores'] = output_dict['detection_scores'][0]
      if 'detection_masks' in output_dict:
        output_dict['detection_masks'] = output_dict['detection_masks'][0]
      return output_dict

def detect():
    image_data = re.sub('^data:image/.+;base64,', '', q.get())
    image = Image.open(BytesIO(base64.b64decode(image_data)))
    image_np = load_image_into_numpy_array(image)
    image_np_expanded = np.expand_dims(image_np, axis=0)
    output_dict = run_inference(image_np_expanded)
    # print(output_dict['detection_classes'])
    return output_dict['detection_classes']


@socketio.on('connect', namespace = '/fingbers')
def test_connect():
	app.logger.info("client is connected")

@socketio.on('input image', namespace = '/fingbers')
def receive_image(frame):
    if not q.full():
        q.put(frame)
        out_q = Queue()
        # thread = threading.Thread(target = lambda b: b.put(detect()), args=(out_q, ))
        # thread.start()
        out_q.put(detect())
        output = out_q.get()
        print(CLASSES[int(output[0])])
        emit('message', CLASSES[int(output[0])])

@app.route('/')
def index():
    return render_template('index.html')
    thread = threading.Thread(target=detect, args=())
    thread.start()

if __name__ == '__main__':
    socketio.run(app)
