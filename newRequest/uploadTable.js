class UploadTablePage {
  constructor() {
    this.initElements();
    this.bindEvents();
    this.initializePlugins();
  }

  initElements() {
    this.$sendTimeInput = $('#sendTimeInput');
    this.$generalReportBtn = $('#generalReportBtn');
    this.$fileInput = $('#fileInput');
    this.$uploadForm = $('#uploadForm');
    this.$reportTable = $('#report-table');
    this.$uploadStatsTable = $('#upload-stats-table');
  }

  initializePlugins() {
    bsCustomFileInput.init();
    this.setDateDefaults();
  }

  setDateDefaults() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const maxDate = yesterday.toISOString().split('T')[0];
    
    this.$sendTimeInput
      .attr('max', maxDate)
      .val(maxDate);
  }

  bindEvents() {
    this.$sendTimeInput.on('change', (e) => this.handleDateChange(e));
    this.$generalReportBtn.on('click', () => this.handleGenerateReport());
    this.$fileInput.on('change', (e) => this.handleFileSelect(e));
    this.$uploadForm.on('submit', (e) => this.handleFileUpload(e));
  }

  handleDateChange(e) {
    const selectedDate = new Date(e.target.value);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (selectedDate > yesterday) {
      alert('Please select a date before today');
      this.$sendTimeInput.val(yesterday.toISOString().split('T')[0]);
    }
  }

  async handleGenerateReport() {
    const sendTime = this.$sendTimeInput.val();
    const appendToDb = $('#appendToDbCheckbox').is(':checked');

    if (!sendTime) {
      alert('Please fill in all required information');
      return;
    }

    try {
      Utils.showLoading(this.$generalReportBtn);
      const data = await this.fetchReportData({
        type: 'undeliveryMobileNo',
        sendTime,
        appendToDb
      });
      this.renderTable(data, '#report-table table');
      this.$reportTable.fadeIn();
    } catch (error) {
      alert('Failed to generate report. Please try again.');
    } finally {
      Utils.hideLoading(this.$generalReportBtn, 'General Report');
    }
  }

  handleFileSelect(e) {
    const fileName = $(e.target).val().split('\\').pop();
    $(e.target).next('.custom-file-label').html(fileName);
  }

  async handleFileUpload(e) {
    e.preventDefault();
    const file = this.$fileInput[0].files[0];
    
    if (file) {
      const $uploadBtn = this.$uploadForm.find('.input-group-append button');
      
      try {
        Utils.showLoading($uploadBtn);
        const data = await this.fetchReportData({
          type: 'marginCustomers',
          file: file
        });
        this.renderTable(data, '#upload-stats-table table');
        this.$uploadStatsTable.fadeIn();
        
        this.$uploadForm[0].reset();
        $('.custom-file-label').html('Choose file');
      } catch (error) {
        alert('Failed to upload file. Please try again.');
      } finally {
        Utils.hideLoading($uploadBtn, 'Upload');
      }
    }
  }

  fetchReportData(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * this.mockDataSets.length);
        resolve(this.mockDataSets[randomIndex]);
      }, 500);
    });
  }

  renderTable(data, tableSelector) {
    const $tbody = $(`${tableSelector} tbody`);
    $tbody.empty();

    const rows = data.records.map(record => `
      <tr>
        <td>${record.code}</td>
        <td>${record.count}</td>
        <td>${record.lastUpdate}</td>
      </tr>
    `).join('');

    $tbody.html(rows);
  }

  mockDataSets = [
    {
      records: [
        { code: "CSLRESPON", count: 150, lastUpdate: "2024-03-20" },
        { code: "CSLRESPON", count: 80, lastUpdate: "2024-03-19" }
      ]
    },
    {
      records: [
        { code: "CSLRESPON", count: 200, lastUpdate: "2024-03-21" }
      ]
    },
    {
      records: [
        { code: "CSLRESPON", count: 180, lastUpdate: "2024-03-22" },
        { code: "CSLRESPON", count: 85, lastUpdate: "2024-03-21" },
        { code: "CSLRESPON", count: 60, lastUpdate: "2024-03-20" }
      ]
    }
  ];
}

// 初始化页面
$(function() {
  new UploadTablePage();
}); 