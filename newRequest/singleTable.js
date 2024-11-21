class SingleTablePage extends BasePage {
  constructor() {
    super();
    this.mockData = {
      noSmsRegistered: [
        {
          acNo: "123456",
          acName: "John Smith"
        },
        {
          acNo: "789012",
          acName: "Mary Johnson"
        }
      ],
      undeliverable: [
        {
          acNo: "345678",
          userName: "Robert Wilson",
          mobilePhone: "9876543210"
        },
        {
          acNo: "901234",
          userName: "Sarah Davis",
          mobilePhone: "8765432109"
        }
      ]
    };
    this.initDataTables();
  }

  initDataTables() {
    // 初始化第一个表格
    this.dataTable1 = $('#table1').DataTable({
      responsive: true,
      lengthChange: false,
      autoWidth: false,
      searching: false,
      ordering: false,
      info: false,
      paging: false,
      columns: [
        { data: 'acNo' },
        { data: 'acName' }
      ]
    });

    // 初始化第二个表格
    this.dataTable2 = $('#table2').DataTable({
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
        { data: 'mobilePhone' }
      ]
    });
  }

  bindEvents() {
    super.bindEvents();
    this.$generalReportBtn.on('click', () => this.handleGenerateReport());
    $('#downloadBtn').on('click', () => this.handleDownload());
  }

  handleGenerateReport() {
    this.renderTables();
    this.updatePageTitle();
    this.showTableSection();
  }

  renderTables() {
    // 更新第一个表格
    this.dataTable1.clear();
    this.dataTable1.rows.add(this.mockData.noSmsRegistered).draw();

    // 更新第二个表格
    this.dataTable2.clear();
    this.dataTable2.rows.add(this.mockData.undeliverable).draw();
  }

  handleDownload() {
    // 下载第一个表格
    Utils.downloadTable('table1', 'No_SMS_Registered_Margin_Customers.xlsx');
    // 下载第二个表格
    setTimeout(() => {
      Utils.downloadTable('table2', 'SMS_Undeliverable_Margin_Customers.xlsx');
    }, 1000);
  }
}

// 初始化页面
$(function() {
  new SingleTablePage();
}); 