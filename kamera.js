/************************************************
 * kamera.js
 * TAHAP 3.1
 * BUKA KAMERA LIVE
 ************************************************/

const video = document.getElementById("video");
const btnBuka = document.getElementById("btnBuka");

const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");

const btnFoto = document.getElementById("btnFoto");
const btnUlang = document.getElementById("btnUlang");

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
/************************************************
 * AMBIL FOTO
 ************************************************/

btnFoto.addEventListener("click", ambilFoto);

function ambilFoto(){

    if(!stream){
        alert("Silakan buka kamera terlebih dahulu.");
        return;
    }

    if(video.videoWidth === 0){
        alert("Kamera masih memuat. Tunggu 1 detik lalu coba lagi.");
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video,0,0);

    const hasil = canvas.toDataURL("image/jpeg",0.9);

    preview.src = hasil;

    preview.style.display = "block";
    video.style.display = "none";

    btnUlang.style.display = "block";

}
/************************************************
 * ULANGI FOTO
 ************************************************/

btnUlang.addEventListener("click", ()=>{

    preview.style.display = "none";
    video.style.display = "block";

    btnUlang.style.display = "none";

});
