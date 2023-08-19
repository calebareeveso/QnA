export default class formattedDate {
  static Today() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "-" + mm + "-" + yyyy;

    // console.log(formattedToday);
    return formattedToday;
  }

  static datediff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  static parseDate(str) {
    let DayMonthYear = str.split("-");
    return new Date(DayMonthYear[2], DayMonthYear[1], DayMonthYear[0] - 1);

    // console.log(datediff(parseDate(`1-1-2000`), parseDate(`3-1-2000`)));
  }
}
