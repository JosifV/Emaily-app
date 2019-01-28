const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export default emails => {
  // ovo je da ne bi bilo errora zbog zareza
  emails = emails.replace(/,\s*$/, "");
  // const invalidEmails je niz koji se automatski napuni emailvima, koje izlistamo sa .map() funcijom, ali zbog .filter() zadrzi samo one koji nisu validni
  const invalidEmails = emails
    .split(",")
    .map(email => email.trim())
    .filter(email => re.test(email) === false);

  if (invalidEmails.length) {
    // zapamti ovo nisu single quotes nego znakovi pored broja jedan
    return `These emails are false: ${invalidEmails}`;
  }
  return;
};
