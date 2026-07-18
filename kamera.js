/************************************************
 * kamera.js
 * TAHAP 3.1
 * BUKA KAMERA LIVE
 ************************************************/

const video = document.getElementById("video");
const btnBuka = document.getElementById("btnBuka");

let stream = null;

/************************************************
 * BUKA KAMERA
 ************************************************/

btnBuka.addEventListener("click", bukaKamera);

async function bukaKamera() {

    // Jika kamera sudah aktif, jangan buka lagi
    if (stream) return;

    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },

            audio: false

        });

        video.srcObject = stream;

        console.log("Kamera berhasil dibuka.");

    } catch (err) {

        console.error(err);

        alert("Tidak dapat membuka kamera.");

    }

}
