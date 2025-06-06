function setLang(lang) {
    document.cookie = 'i18next=' + lang + '; path=/';
    location.reload();
}