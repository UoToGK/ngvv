import { Component } from '@angular/core';
import { SmartTableService } from 'src/app/@core/mock/smart-table.service';
import { LocalDataSource } from 'src/framework/theme/components/table/lib/data-source/local/local.data-source';
// import { LocalDataSource } from 'ng2-smart-table';



@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent {
  value = 25;

  get status() {
    if (this.value <= 25) {
      return 'danger';
    } else if (this.value <= 50) {
      return 'warning';
    } else if (this.value <= 75) {
      return 'info';
    } else {
      return 'success';
    }
  }
  settings = {
    add: {
      addButtonContent: '<i class="ion-plus"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      nickname: {
        title: '昵称',
        type: 'text',
      },
      // avatar_larger_url: {
      //   title: 'avatar_larger_url',
      //   type: 'text',
      // },
      create_time: {
        title: '创建时间',
        type: 'text',
      },
      custom_signature: {
        title: '个性签名',
        type: 'string',
      },
      // share_url: {
      //   title: 'share_url',
      //   type: 'string',
      // },
      // cover_url: {
      //   title: 'cover_url',
      //   type: 'string',
      // },
      desc: {
        title: '文字描述',
        type: 'string',
      },
      custom_verify: {
        title: '个人认证',
        type: 'string',
      },
      // mp4: {
      //   title: 'mp4',
      //   type: 'string',
      // },
      // music_url: {
      //   title: 'music_url',
      //   type: 'string',
      // },
      // text_extra: {
      //   title: 'text_extra',
      //   type: 'string',
      // },
      type: {
        title: '类型',
        type: 'string',
      },
      unique_id: {
        title: '全网唯一ID',
        type: 'string',
      },
      // statistics: {
      //   title: 'statistics',
      //   type: 'string',
      // },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  loading = true;
  constructor(private service: SmartTableService) {
    setTimeout(() => {
      while(this.value<100){
        this.value++
      }
      this.initData()
      this.loading=false

    }, 2000);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
    }
  initData(){
    const data = this.service.getData();
    console.log(data.length)
    this.source.load(data);
  }
}
