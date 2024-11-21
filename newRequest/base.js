class BasePage {
  constructor() {
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.$pageTitle = $('#pageTitle');
    this.$welcomeSection = $('#welcome-section');
    this.$tablesSection = $('#tables-section');
    this.$backBtn = $('#backBtn');
    this.$generalReportBtn = $('#generalReportBtn');
  }

  bindEvents() {
    if (this.$backBtn.length) {
      this.$backBtn.on('click', () => this.handleBack());
    }
  }

  handleBack() {
    this.$tablesSection.hide();
    this.$welcomeSection.show();
    this.resetPageTitle();
  }

  showTableSection() {
    this.$welcomeSection.hide();
    this.$tablesSection.css('display', 'block').css('opacity', 0);
    setTimeout(() => {
      this.$tablesSection.css({
        'transition': 'opacity 0.5s ease',
        'opacity': 1
      });
    }, 10);
  }

  resetPageTitle() {
    this.$pageTitle.text(document.title.split('|')[1].trim());
  }

  updatePageTitle(suffix) {
    const currentDate = Utils.formatDate(new Date());
    this.$pageTitle.text(`${document.title.split('|')[1].trim()} as at ${currentDate}`);
  }
} 