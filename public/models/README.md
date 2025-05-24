# Face-API.js Models

For the facial analysis functionality to work properly, you need to download the following models from the face-api.js GitHub repository:

1. **Tiny Face Detector Model:**
   - tiny_face_detector_model-shard1
   - tiny_face_detector_model-weights_manifest.json

2. **Face Landmark Model:**
   - face_landmark_68_model-shard1
   - face_landmark_68_model-weights_manifest.json

3. **Face Expression Model:**
   - face_expression_model-shard1
   - face_expression_model-weights_manifest.json

## How to Download

You can download these models from the official face-api.js GitHub repository:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Place all the model files directly in this directory (public/models/).

## Alternative Setup

You can use a CDN version of these models by modifying the FacialAnalysis.tsx component to use the following URL instead:
```
const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
``` 