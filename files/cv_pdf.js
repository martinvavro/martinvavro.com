document.querySelector("#downloadCv").addEventListener("click", function () {
  var firstPage = document.querySelector("#firstPageCv");
  var secondPage = document.querySelector("#secondPageCv");
  var controlos = document.querySelector(".controls");
  show(firstPage);
  show(secondPage);
  hide(controlos);
  var printWindow = window.open("", "", "height=400,width=800");
  printWindow.document.write("<html><head><title>Martin_Vavro_CV</title>");
  printWindow.document.write("</head><body >");
  printWindow.document.write(document.querySelector(".pageWrapper").innerHTML);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
  hide(secondPage);
  show(controlos);
  printWindow.close();
});
