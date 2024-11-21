class AccountMaintenancePage {
  constructor() {
    this.currentEditRow = null;
    this.operationLogs = [];
    this.initElements();
    this.initDataTable();
    this.bindEvents();
  }

  initElements() {
    this.$accountTable = $('#accountTable');
    this.$accountLogTimeline = $('#accountLogTimeline');
    this.$addForm = $('#addForm');
    this.$editForm = $('#editForm');
  }

  initDataTable() {
    this.dataTable = this.$accountTable.DataTable({
      responsive: true,
      lengthChange: false,
      autoWidth: false,
      searching: false,
      ordering: false,
      info: false,
      paging: false,
      columns: [
        { data: 'account' },
        { data: 'reason' },
        { data: 'lastUpdate' },
        {
          data: null,
          render: function(data, type, row) {
            return `
              <button type="button" class="btn btn-sm btn-info" data-action="edit">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="btn btn-sm btn-danger" data-action="delete">
                <i class="fas fa-trash"></i>
              </button>
              <button type="button" class="btn btn-sm btn-secondary" data-action="viewLog">
                <i class="fas fa-history"></i>
              </button>
            `;
          }
        }
      ]
    });
  }

  bindEvents() {
    // 绑定添加账户事件
    $('#modal-add .btn-primary').on('click', () => this.addAccount());
    // 绑定更新账户事件
    $('#modal-edit .btn-primary').on('click', () => this.updateAccount());
    
    // 使用事件委托处理表格中的按钮点击
    this.$accountTable.on('click', 'button', (e) => {
      const action = $(e.currentTarget).data('action');
      const row = this.dataTable.row($(e.currentTarget).closest('tr'));
      
      switch (action) {
        case 'edit':
          this.editAccount(row);
          break;
        case 'delete':
          this.deleteAccount(row);
          break;
        case 'viewLog':
          this.viewAccountLog(row);
          break;
      }
    });
  }

  addLog(operationType, details, status) {
    const now = new Date();
    const log = {
      time: now.toLocaleString(),
      type: operationType,
      details: details,
      status: status
    };
    this.operationLogs.unshift(log);
    this.updateLogTimeline(this.operationLogs);
  }

  updateLogTimeline(logs) {
    this.$accountLogTimeline.empty();
    let currentDate = '';
    
    logs.forEach(log => {
      const logDate = new Date(log.time);
      const dateStr = logDate.toLocaleDateString();
      const timeStr = logDate.toLocaleTimeString();
      
      if (dateStr !== currentDate) {
        currentDate = dateStr;
        this.$accountLogTimeline.append(`
          <div class="time-label">
            <span class="bg-primary">${dateStr}</span>
          </div>
        `);
      }

      let iconClass = 'fas fa-edit bg-blue';
      if (log.type === 'Add Account') {
        iconClass = 'fas fa-plus bg-green';
      } else if (log.type === 'Delete Account') {
        iconClass = 'fas fa-trash bg-red';
      }

      this.$accountLogTimeline.append(`
        <div>
          <i class="${iconClass}"></i>
          <div class="timeline-item">
            <span class="time"><i class="fas fa-clock"></i> ${timeStr}</span>
            <h3 class="timeline-header">${log.type}</h3>
            <div class="timeline-body">
              ${log.details}
            </div>
            <div class="timeline-footer">
              <span class="badge badge-${log.status === 'Success' ? 'success' : 'danger'}">${log.status}</span>
            </div>
          </div>
        </div>
      `);
    });

    this.$accountLogTimeline.append(`
      <div>
        <i class="fas fa-clock bg-gray"></i>
      </div>
    `);
  }

  addAccount() {
    const $accountInput = $('#accountInput');
    const $reasonInput = $('#reasonInput');
    
    if (!$accountInput.val() || !$reasonInput.val()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const now = new Date().toISOString().split('T')[0];
      
      // 使用 DataTable API 添加数据
      this.dataTable.row.add({
        account: $accountInput.val(),
        reason: $reasonInput.val(),
        lastUpdate: now
      }).draw();

      $('#modal-add').modal('hide');
      this.$addForm[0].reset();

      this.addLog(
        'Add Account',
        `Added new account: ${$accountInput.val()}, reason: ${$reasonInput.val()}`,
        'Success'
      );
    } catch (error) {
      this.addLog(
        'Add Account',
        `Failed to add account: ${$accountInput.val()}`,
        'Failed'
      );
    }
  }

  editAccount(row) {
    const data = row.data();
    this.currentEditRow = row;
    
    $('#editAccountInput').val(data.account);
    $('#editReasonInput').val(data.reason);
    
    $('#modal-edit').modal('show');
  }

  updateAccount() {
    if (!this.currentEditRow) return;
    
    const $accountInput = $('#editAccountInput');
    const $reasonInput = $('#editReasonInput');
    
    if (!$accountInput.val() || !$reasonInput.val()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const now = new Date().toISOString().split('T')[0];
      const oldData = this.currentEditRow.data();
      
      // 使用 DataTable API 更新数据
      this.currentEditRow.data({
        account: $accountInput.val(),
        reason: $reasonInput.val(),
        lastUpdate: now
      }).draw();

      $('#modal-edit').modal('hide');
      this.$editForm[0].reset();
      this.currentEditRow = null;

      this.addLog(
        'Update Account',
        `Updated account from "${oldData.account}" (${oldData.reason}) to "${$accountInput.val()}" (${$reasonInput.val()})`,
        'Success'
      );
    } catch (error) {
      this.addLog(
        'Update Account',
        `Failed to update account: ${$accountInput.val()}`,
        'Failed'
      );
    }
  }

  deleteAccount(row) {
    const data = row.data();

    if (confirm('Are you sure you want to delete this account?')) {
      try {
        // 使用 DataTable API 删除数据
        row.remove().draw();
        
        this.addLog(
          'Delete Account',
          `Deleted account: ${data.account} (${data.reason})`,
          'Success'
        );
      } catch (error) {
        this.addLog(
          'Delete Account',
          `Failed to delete account: ${data.account}`,
          'Failed'
        );
      }
    }
  }

  viewAccountLog(row) {
    const data = row.data();
    
    const logs = this.operationLogs.filter(log => 
      log.details.includes(data.account)
    );
    
    this.updateLogTimeline(logs);
    $('#accountLogModal').modal('show');
  }
}

// 初始化页面
$(function() {
  new AccountMaintenancePage();
}); 