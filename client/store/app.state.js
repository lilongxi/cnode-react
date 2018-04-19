import { observable, computed, action } from 'mobx'

class AppState {
  // 用于初始化state，从外部传入
  constructor({count, name} = {count: 0, name: 'leelongxi'}){
    this.count = count
    this.name = name
  }
  @observable count
  @observable name
  @computed get msg() {
    return `${this.name} count ${this.count}`
  }
  @action add() {
    this.count += 1
  }
  toJson(){
    // 返回服务端渲染的数据
    return {
      count: this.count,
      name: this.name
    }
  }
}

export default AppState
