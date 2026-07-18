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

const lokasi = document.getElementById("lokasi");
/************************************************
 * TITIK SPPG
 ************************************************/

const LAT_SPPG = -7.96190882762548;
const LNG_SPPG = 112.71223884570689;

const RADIUS_SPPG = 45; // meter

let jarakSPPG = 0;
let statusLokasi = "";
let latitude = "";
let longitude = "";
let alamat = "";
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

ambilGPS();

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

/************************************************
 * GPS
 ************************************************/

function ambilGPS() {

    lokasi.innerHTML = "Mengambil lokasi...";

    if (!navigator.geolocation) {
        lokasi.innerHTML = "Browser tidak mendukung GPS.";
        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(pos){

            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;

            jarakSPPG = hitungJarak(
                latitude,
                longitude,
                LAT_SPPG,
                LNG_SPPG
            );

            jarakSPPG = Math.round(jarakSPPG);

            if (jarakSPPG <= RADIUS_SPPG) {

                statusLokasi = "🟢 Lokasi sesuai";

            } else {

                statusLokasi = "🟡 Lokasi berada di luar radius SPPG";

            }

            lokasi.innerHTML = `
                <b>📍 Status Lokasi</b><br><br>

                ${statusLokasi}<br><br>

                Jarak Anda : <b>${jarakSPPG} meter</b><br>
                Radius SPPG : <b>${RADIUS_SPPG} meter</b>
            `;

        },

        function(error){

            lokasi.innerHTML = "GPS gagal : " + error.message;

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}
    /************************************************
 * HITUNG JARAK (HAVERSINE)
 ************************************************/

function hitungJarak(lat1, lon1, lat2, lon2){

    const R = 6371000;

    const dLat = (lat2-lat1) * Math.PI/180;
    const dLon = (lon2-lon1) * Math.PI/180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) *
        Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;

}

    );

}
