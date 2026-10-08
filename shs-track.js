/* Senior Home Safety — site tracking (Google Ads + Google Analytics 4).
   One file, loaded on every page of novoseniorsafety.com and book.novoseniorsafety.com.
   To change an ID, edit SHS_TRACK below; an empty value switches that piece off.
   Records no names, emails, phone numbers or form answers — only that something happened. */
(function () {
  var SHS_TRACK = {
    // GA4 (G-8WHTX9P14G) is linked inside the Google tag GT-55KSRDBV, so loading the Ads tag below
    // already sends every page view and event to GA4. Leave this empty, or visits are counted twice.
    GA4: "",
    ADS: "AW-18450182689",                              // Google Ads account tag
    ADS_LEAD: "AW-18450182689/tTadCPjLkfccEKHk3d1E",    // Ads conversion: call request / checklist sign-up
    ADS_BOOKING: "AW-18450182689/FmDzCOLFypUdEKHk3d1E", // Ads conversion: "Online booking (paid)"
    ADS_PHONE: "AW-18450182689/igEbCOXFypUdEKHk3d1E",   // Ads conversion: "Phone tap on website"
    LEAD_VALUE: 150                                     // Value given to a lead in Google Ads, CAD
  };

  var first = SHS_TRACK.GA4 || SHS_TRACK.ADS;
  if (!first) { window.shsTrack = function () {}; return; }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(first);
  document.head.appendChild(s);

  gtag("js", new Date());
  // Cookies are set on .novoseniorsafety.com, so a visitor who clicks an ad on the main site
  // and pays on book.novoseniorsafety.com is still counted as the same visit.
  // Booking-site links carry a private booking code (?t=…): never send it to Google.
  var cfg = { cookie_domain: "auto" };
  if (location.hostname.indexOf("book.") === 0) cfg.page_location = location.origin + location.pathname;
  if (SHS_TRACK.ADS) gtag("config", SHS_TRACK.ADS, cfg);
  if (SHS_TRACK.GA4) gtag("config", SHS_TRACK.GA4, cfg);

  function ads(label, extra) {
    if (!label) return;
    var p = { send_to: label };
    for (var k in extra) p[k] = extra[k];
    gtag("event", "conversion", p);
  }

  // shsTrack(name, params): the one function pages call.
  window.shsTrack = function (name, params) {
    params = params || {};
    gtag("event", name, params);                       // GA4 (key events are chosen in GA4 Admin)
    if (name === "generate_lead") ads(SHS_TRACK.ADS_LEAD, { value: SHS_TRACK.LEAD_VALUE, currency: "CAD" });
    if (name === "phone_click") ads(SHS_TRACK.ADS_PHONE, {});
    if (name === "purchase") ads(SHS_TRACK.ADS_BOOKING, { value: params.value, currency: "CAD", transaction_id: params.transaction_id });
  };

  // Clicks anywhere on the page: phone taps, Book Online buttons, PDF downloads.
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var where = a.getAttribute("data-track") || "";
    if (href.indexOf("tel:") === 0) window.shsTrack("phone_click", { link_location: where });
    else if (href.indexOf("book.novoseniorsafety.com") !== -1) window.shsTrack("book_online_click", { link_location: where });
    else if (/SHS_Sample_Report\.pdf/i.test(href)) window.shsTrack("sample_report_download", {});
    else if (/SHS_Home_Safety_Checklist\.pdf/i.test(href)) window.shsTrack("checklist_download", {});
  }, true);
})();
