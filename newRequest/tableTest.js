class TableTestPage extends BasePage {
  constructor() {
    super();
    this.mockData = [
      {
        acNo: "123456",
        userName: "John Smith",
        reason: "Invalid Number",
        mobilePhone: "9876543210",
        reasonLastUpdate: "2024-03-20 15:30:25"
      },
      {
        acNo: "789012",
        userName: "Mary Johnson",
        reason: "Network Error",
        mobilePhone: "8765432109",
        reasonLastUpdate: "2024-03-20 15:30:25"
      },
      {
        acNo: "345678",
        userName: "Robert Wilson",
        reason: "Unsubscribed",
        mobilePhone: "7654321098",
        reasonLastUpdate: "2024-03-20 15:30:25"
      }
    ];
    this.initDataTable();
  }

  initDataTable() {
    this.dataTable = $('#table1').DataTable({
      responsive: true,
      lengthChange: false,
      autoWidth: false,
      searching: false,
      ordering: false,
      info: false,
      paging: false,
      columns: [
        { data: 'acNo' },
        { data: 'userName' },
        { data: 'reason' },
        { data: 'mobilePhone' },
        { data: 'reasonLastUpdate' }
      ]
    });
  }

  bindEvents() {
    super.bindEvents();
    this.$generalReportBtn.on('click', () => this.handleGenerateReport());
    $('#downloadBtn').on('click', () => this.handleDownload());
  }

  async handleGenerateReport() {
    try {
      Utils.showLoading(this.$generalReportBtn);
      const data = await this.fetchReportData();
      this.renderTable(data);
      this.updatePageTitle();
      this.showTableSection();
    } catch (error) {
      alert('Failed to generate report. Please try again.');
    } finally {
      Utils.hideLoading(this.$generalReportBtn, 'General Report');
    }
  }

  fetchReportData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = Math.floor(Math.random() * 3) + 1;
        resolve(this.mockData.slice(0, count));
      }, 500);
    });
  }

  renderTable(data) {
    this.dataTable.clear();
    this.dataTable.rows.add(data).draw();
  }

  handleDownload() {
    Utils.downloadTable('table1', 'SMS_Undeliverable_Margin_Customers_With_Reason.xlsx');
  }
}

// 初始化页面
$(function() {
  new TableTestPage();
}); 