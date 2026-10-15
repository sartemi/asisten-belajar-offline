/**
 * DATA PENGETAHUAN MODUL
 * Sesuai permintaan pengguna:
 * Awalnya daftar modul dibuat KOSONG ([]).
 * Modul akan terisi setelah pengguna meng-upload file modul (.txt / .pdf)
 * atau memilih impor bahan melalui antarmuka web.
 */

var MODULES_DATA = [];

if (typeof window !== 'undefined') {
  window.MODULES_DATA = MODULES_DATA;
} else if (typeof globalThis !== 'undefined') {
  globalThis.MODULES_DATA = MODULES_DATA;
}
