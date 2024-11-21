class ReasonMaintenancePage {
  constructor() {
    this.currentEditRow = null;
    this.operationLogs = [];
    this.initElements();
    this.initDataTable();
    this.bindEvents();
  }

  initElements() {
    this.$reasonTable = $('#reasonTable');
    this.$reasonLogTimeline = $('#reasonLogTimeline');
    this.$addForm = $('#addForm');
    this.$editForm = $('#editForm');
  }

  initDataTable() {
    this.dataTable = this.$reasonTable.DataTable({
      responsive: true,
      lengthChange: false,
      autoWidth: false,
      searching: false,
      ordering: false,
      info: false,
      paging: false,
      columns: [
        { data: 'reasonCode' },
        { data: 'description' },
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
    // 绑定添加原因事件
    $('#modal-add .btn-primary').on('click', () => this.addReason());
    // 绑定更新原因事件
    $('#modal-edit .btn-primary').on('click', () => this.updateReason());
    
    // 使用事件委托处理表格中的按钮点击
    this.$reasonTable.on('click', 'button', (e) => {
      const action = $(e.currentTarget).data('action');
      const row = this.dataTable.row($(e.currentTarget).closest('tr'));
      
      switch (action) {
        case 'edit':
          this.editReason(row);
          break;
        case 'delete':
          this.deleteReason(row);
          break;
        case 'viewLog':
          this.viewReasonLog(row);
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
    this.$reasonLogTimeline.empty();
    let currentDate = '';
    
    logs.forEach(log => {
      const logDate = new Date(log.time);
      const dateStr = logDate.toLocaleDateString();
      const timeStr = logDate.toLocaleTimeString();
      
      if (dateStr !== currentDate) {
        currentDate = dateStr;
        this.$reasonLogTimeline.append(`
          <div class="time-label">
            <span class="bg-primary">${dateStr}</span>
          </div>
        `);
      }

      let iconClass = 'fas fa-edit bg-blue';
      if (log.type === 'Add Reason') {
        iconClass = 'fas fa-plus bg-green';
      } else if (log.type === 'Delete Reason') {
        iconClass = 'fas fa-trash bg-red';
      }

      this.$reasonLogTimeline.append(`
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

    this.$reasonLogTimeline.append(`
      <div>
        <i class="fas fa-clock bg-gray"></i>
      </div>
    `);
  }

  addReason() {
    const $reasonCode = $('#reasonCodeInput');
    const $description = $('#descriptionInput');
    
    if (!$reasonCode.val() || !$description.val()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const now = new Date().toISOString().split('T')[0];
      
      // 使用 DataTable API 添加数据
      this.dataTable.row.add({
        reasonCode: $reasonCode.val(),
        description: $description.val(),
        lastUpdate: now
      }).draw();

      $('#modal-add').modal('hide');
      this.$addForm[0].reset();

      this.addLog(
        'Add Reason',
        `Added new reason code: ${$reasonCode.val()}, description: ${$description.val()}`,
        'Success'
      );
    } catch (error) {
      this.addLog(
        'Add Reason',
        `Failed to add reason code: ${$reasonCode.val()}`,
        'Failed'
      );
    }
  }

  editReason(row) {
    const data = row.data();
    this.currentEditRow = row;
    
    $('#editReasonCodeInput').val(data.reasonCode);
    $('#editDescriptionInput').val(data.description);
    
    $('#modal-edit').modal('show');
  }

  updateReason() {
    if (!this.currentEditRow) return;
    
    const $reasonCode = $('#editReasonCodeInput');
    const $description = $('#editDescriptionInput');
    
    if (!$reasonCode.val() || !$description.val()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const now = new Date().toISOString().split('T')[0];
      const oldData = this.currentEditRow.data();
      
      // 使用 DataTable API 更新数据
      this.currentEditRow.data({
        reasonCode: $reasonCode.val(),
        description: $description.val(),
        lastUpdate: now
      }).draw();

      $('#modal-edit').modal('hide');
      this.$editForm[0].reset();
      this.currentEditRow = null;

      this.addLog(
        'Update Reason',
        `Updated reason code from "${oldData.reasonCode}" (${oldData.description}) to "${$reasonCode.val()}" (${$description.val()})`,
        'Success'
      );
    } catch (error) {
      this.addLog(
        'Update Reason',
        `Failed to update reason code: ${$reasonCode.val()}`,
        'Failed'
      );
    }
  }

  deleteReason(row) {
    const data = row.data();

    if (confirm('Are you sure you want to delete this reason?')) {
      try {
        // 使用 DataTable API 删除数据
        row.remove().draw();
        
        this.addLog(
          'Delete Reason',
          `Deleted reason code: ${data.reasonCode} (${data.description})`,
          'Success'
        );
      } catch (error) {
        this.addLog(
          'Delete Reason',
          `Failed to delete reason code: ${data.reasonCode}`,
          'Failed'
        );
      }
    }
  }

  viewReasonLog(row) {
    const data = row.data();
    
    const logs = this.operationLogs.filter(log => 
      log.details.includes(data.reasonCode)
    );
    
    this.updateLogTimeline(logs);
    $('#reasonLogModal').modal('show');
  }
}

// 初始化页面
$(function() {
  new ReasonMaintenancePage();
}); 