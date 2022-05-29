const recordButton = document.querySelector('.record');
const stopButton = document.querySelector('.stop')

recordButton.addEventListener('click', () => {
  blurScreen();
  recordAudio();
});

stopButton.addEventListener('click', e => {
  console.log("hello");
})

const blurScreen = () => {
  console.log('hi')
  const text = document.querySelector(".text-display")
  text.setAttribute('style', 'opacity: 0')
}

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const handleAction = async () => {
  const recorder = await recordAudio();
  const actionButton = document.getElementById("action");
  actionButton.disabled = true;
  recorder.start();
  await sleep(3000);
  const audio = await recorder.stop();
  audio.play();
  await sleep(3000);
  actionButton.disabled = false;
};
