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

setInterval(updateJam,1000);

updateJam();
