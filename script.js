/************************************************
 * script.js
 * ABSENSI RELAWAN SPPG
 ************************************************/

const API_URL =
"https://script.google.com/macros/s/AKfycbwmWULLU8GirkYhRUiflrqgxfUM5fHhxTm_sm-VbgXtmwcg6YX35ZTHC0g59rzsE0pj8Q/exec";

const divisi = document.getElementById("divisi");
const relawan = document.getElementById("relawan");

const btnDatang = document.getElementById("btnDatang");
const btnPulang = document.getElementById("btnPulang");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");

const btnSelfie = document.getElementById("btnSelfie");
const btnAbsen = document.getElementById("btnAbsen");
const btnReset = document.getElementById("btnReset");

let stream = null;
let latitude = "";
let longitude = "";
let statusLokasi = "";
let jarakMeter = 0;
let fotoBase64 = "";

let jenisAbsen = "";

btnDatang.onclick = () => {

    jenisAbsen = "DATANG";

    btnDatang.classList.add("active");
    btnPulang.classList.remove("active");

}

btnPulang.onclick = () => {

    jenisAbsen = "PULANG";

    btnPulang.classList.add("active");
    btnDatang.classList.remove("active");

}


/************************************************
 * LOAD DIVISI
 ************************************************/

window.onload = () => {

    loadDivisi();

    bukaKamera();

    ambilLokasi();

};

/************************************************
 * Ambil Divisi
 ************************************************/

async function loadDivisi(){

    divisi.innerHTML = "<option>Memuat...</option>";

    try{

        const response = await fetch(API_URL + "?action=divisi");

        const data = await response.json();

        divisi.innerHTML = "";

        const awal = document.createElement("option");
        awal.value = "";
        awal.text = "-- Pilih Divisi --";
        divisi.appendChild(awal);

        data.forEach(item=>{

            const option=document.createElement("option");

            option.value=item;

            option.text=item;

            divisi.appendChild(option);

        });

    }catch(err){

        alert("Gagal mengambil daftar divisi");

        console.log(err);

    }

}

/************************************************
 * Ketika Divisi berubah
 ************************************************/

divisi.addEventListener("change",()=>{

    if(divisi.value==""){

        relawan.innerHTML="<option>Pilih Divisi dahulu</option>";
      // tidak perlu apa-apa
        return;

    }

    loadRelawan(divisi.value);
 
});


/************************************************
 * Ambil Relawan
 ************************************************/

async function loadRelawan(namaDivisi){

    relawan.innerHTML="<option>Memuat...</option>";

    try{

        const response = await fetch(

            API_URL +

            "?action=relawan&divisi=" +

            encodeURIComponent(namaDivisi)

        );

        const data = await response.json();

        relawan.innerHTML="";

        const awal=document.createElement("option");

        awal.value="";

        awal.text="-- Pilih Relawan --";

        relawan.appendChild(awal);

        data.forEach(item=>{

            const option=document.createElement("option");

            option.value=item;

            option.text=item;

            relawan.appendChild(option);

        });
  
    }catch(err){

        alert("Gagal mengambil relawan");

        console.log(err);

    }

}


/************************************************
 * JAM & TANGGAL
 ************************************************/

function updateJam() {

    const sekarang = new Date();

    const hari = [
        "Minggu","Senin","Selasa","Rabu",
        "Kamis","Jumat","Sabtu"
    ];

    const bulan = [
        "Januari","Februari","Maret","April",
        "Mei","Juni","Juli","Agustus",
        "September","Oktober","November","Desember"
    ];

    const tanggal =
        hari[sekarang.getDay()] + ", " +
        sekarang.getDate() + " " +
        bulan[sekarang.getMonth()] + " " +
        sekarang.getFullYear();

    const jam =
        sekarang.toLocaleTimeString("id-ID") + " WIB";

    document.getElementById("tanggal").innerHTML = tanggal;
    document.getElementById("jam").innerHTML = jam;

}
/************************************************
 * KAMERA
 ************************************************/

async function bukaKamera(){

    try{

        stream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user"
            },

            audio:false

        });

        video.srcObject = stream;
        await video.play();

    }catch(err){

        alert("Kamera tidak dapat dibuka.");

        console.log(err);

    }

}
/************************************************
 * AMBIL SELFIE
 ************************************************/

btnSelfie.onclick = function(){

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video,0,0);

    fotoBase64 = canvas.toDataURL("image/jpeg",0.8);

    preview.src = fotoBase64;
    preview.style.display = "block";

};
setInterval(updateJam,1000);

updateJam();

/************************************************
 * GPS
 ************************************************/

// Ganti dengan koordinat SPPG Anda
const LAT_SPPG = -7.961899530386746;
const LNG_SPPG = 112.71225527423954;

const RADIUS = 45; // meter

function ambilLokasi(){

    if(!navigator.geolocation){

        document.getElementById("statusLokasi").innerHTML =
        "GPS tidak didukung";

        return;

    }

   navigator.geolocation.watchPosition(
    suksesLokasi,
    gagalLokasi,
    {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
    }
);

}
function suksesLokasi(pos){

    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;

    jarakMeter = hitungJarak(
        LAT_SPPG,
        LNG_SPPG,
        latitude,
        longitude
    );

    if(jarakMeter <= RADIUS){

        statusLokasi = "🟢 Dalam Radius";

    }else{

        statusLokasi = "🔴 Di Luar Radius";

    }

    document.getElementById("statusLokasi").innerHTML =
    statusLokasi;

    document.getElementById("jarak").innerHTML =
    Math.round(jarakMeter) + " Meter";

}
function gagalLokasi(error){

    console.error("GPS Error:", error);

    document.getElementById("statusLokasi").innerHTML =
        "GPS Gagal (" + error.code + ")";
}
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

    const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

    return R*c;

}
