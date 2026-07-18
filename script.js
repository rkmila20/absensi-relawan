/************************************************
 * script.js
 * ABSENSI RELAWAN SPPG
 ************************************************/

const API_URL =
"https://script.google.com/macros/s/AKfycbwmWULLU8GirkYhRUiflrqgxfUM5fHhxTm_sm-VbgXtmwcg6YX35ZTHC0g59rzsE0pj8Q/exec";

const divisi = document.getElementById("divisi");
const relawan = document.getElementById("relawan");
const jenis = document.getElementById("jenis");
const btnLanjut = document.getElementById("btnLanjut");

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
 * Tombol Lanjut
 ************************************************/

btnLanjut.addEventListener("click",()=>{

    if(divisi.value==""){
        alert("Silakan pilih divisi.");
        return;
    }

    if(relawan.value==""){
        alert("Silakan pilih nama relawan.");
        return;
    }

    if(jenis.value==""){
        alert("Silakan pilih jenis absen.");
        return;
    }

    // Simpan data sementara
    sessionStorage.setItem("divisi", divisi.value);
    sessionStorage.setItem("relawan", relawan.value);
    sessionStorage.setItem("jenis", jenis.value);

    // Pindah ke halaman kamera
    window.location.href = "kamera.html";

});
