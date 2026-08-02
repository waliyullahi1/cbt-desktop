<template>
<div class="liveness-container">

<h2>Face Verification</h2>

<div class="camera-frame">
<video ref="video" autoplay playsinline></video>
<div class="face-guide"></div>
</div>

<div class="status">

<p class="step">
Level {{ level }} | Step {{ currentStep + 1 }} / {{ actions.length }}
</p>

<p class="instruction">{{ instruction }}</p>

<p v-if="noFace" class="warning">
⚠ Head not detected. Please face the camera clearly.
</p>

<p v-if="darkImage" class="warning">
⚠ Image too dark or unclear. Please improve lighting.
</p>

</div>

<div v-if="verified" class="success">
✅ Verification Successful
</div>

<div v-if="failed" class="fail">
❌ Verification Failed
</div>

</div>
</template>

<script>
import { FaceMesh } from "@mediapipe/face_mesh"
import { Camera } from "@mediapipe/camera_utils"

export default {

data(){
return{

level:1,
maxLevel:3,

actions:[],
currentStep:0,

instruction:"",

verified:false,
failed:false,

noFace:false,
darkImage:false,

previousEyeOpen:true,
actionCompleted:false,

timer:null

}
},

mounted(){
this.startSystem()
},

methods:{

/* ================= SYSTEM START ================= */

startSystem(){

this.generateActions()
this.updateInstruction()

const video = this.$refs.video

const faceMesh = new FaceMesh({
locateFile:(file)=>{
return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
}
})

faceMesh.setOptions({
maxNumFaces:1,
refineLandmarks:true,
minDetectionConfidence:0.8,
minTrackingConfidence:0.8
})

faceMesh.onResults(this.onResults)

const camera = new Camera(video,{
onFrame: async ()=>{
await faceMesh.send({image:video})
},
width:400,
height:400
})

camera.start()

this.startTimer()

},

/* ================= RANDOM ACTIONS ================= */

generateActions(){

const all = ["blink","left","right","smile"]

this.actions = all
.sort(()=>Math.random()-0.5)
.slice(0,3)

},

/* ================= SPEAK ================= */

speak(text){
const speech = new SpeechSynthesisUtterance()
speech.text = text
speech.lang = "en-US"
window.speechSynthesis.cancel()
window.speechSynthesis.speak(speech)
},

/* ================= INSTRUCTION ================= */

updateInstruction(){

const action = this.actions[this.currentStep]

if(action==="blink")
this.instruction="Please blink your eyes"

if(action==="left")
this.instruction="Turn your head to the left"

if(action==="right")
this.instruction="Turn your head to the right"

if(action==="smile")
this.instruction="Please smile"

this.speak(this.instruction)

},

/* ================= TIMER ================= */

startTimer(){

clearTimeout(this.timer)

this.timer = setTimeout(()=>{

this.failed = true
this.speak("Verification failed")

},10000)

},

/* ================= NEXT STEP ================= */

nextStep(){

clearTimeout(this.timer)

this.currentStep++

if(this.currentStep >= this.actions.length){

if(this.level < this.maxLevel){

this.level++
this.currentStep = 0
this.generateActions()
this.updateInstruction()
this.startTimer()

}else{

this.verified = true
this.speak("Verification successful")

}

return
}

this.updateInstruction()
this.startTimer()

},

/* ================= FACE ANALYSIS ================= */

onResults(results){

/* No Face */

if(!results.multiFaceLandmarks){

this.noFace = true
return
}

this.noFace = false

const landmarks = results.multiFaceLandmarks[0]

/* Lighting Check */

const brightnessCheck = landmarks[1].z

if(brightnessCheck > 0.5){

this.darkImage = true
return
}

this.darkImage = false

const leftEye = landmarks[159].y
const rightEye = landmarks[386].y
const nose = landmarks[1].x
const mouthTop = landmarks[13].y
const mouthBottom = landmarks[14].y

const currentAction = this.actions[this.currentStep]

/* Blink */

if(currentAction==="blink"){

if(leftEye > 0.40 && rightEye > 0.40 && this.previousEyeOpen){

this.nextStep()

}

this.previousEyeOpen = leftEye < 0.35

}

/* Head Left */

if(currentAction==="left"){

if(nose > 0.60){
this.nextStep()
}

}

/* Head Right */

if(currentAction==="right"){

if(nose < 0.40){
this.nextStep()
}

}

/* Smile */

if(currentAction==="smile"){

if(mouthBottom - mouthTop > 0.05){
this.nextStep()
}

}

}

}

}
</script>

<style scoped>

.liveness-container{
max-width:420px;
margin:auto;
text-align:center;
font-family:Arial;
}

.camera-frame{
width:320px;
height:320px;
margin:auto;
border-radius:50%;
overflow:hidden;
border:5px solid #4CAF50;
position:relative;
}

video{
width:100%;
height:100%;
object-fit:cover;
}

.face-guide{
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
width:220px;
height:260px;
border:3px dashed white;
border-radius:50%;
pointer-events:none;
}

.status{
margin-top:20px;
}

.step{
font-weight:bold;
color:#777;
}

.instruction{
font-size:20px;
font-weight:bold;
margin-top:5px;
}

.warning{
color:#e67e22;
margin-top:10px;
}

.success{
margin-top:20px;
color:#27ae60;
font-size:22px;
font-weight:bold;
}

.fail{
margin-top:20px;
color:#e74c3c;
font-size:22px;
font-weight:bold;
}

</style>