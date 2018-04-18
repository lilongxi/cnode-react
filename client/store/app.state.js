import { observable, computed, action } from 'mobx'

class AppState {
  @observable count = 0
  @observable name = 'lilongxi'
  @computed get msg() {
    return `${this.name} count ${this.count}`
  }
  @action add() {
    this.count += 1
  }
}

export default AppState
