import Vue from 'vue'
import Main from './message.vue'

let MessageConstructor = Vue.extend(Main)

let instance
let instances = []
let seed = 0
const Message = function (options) {
  const Opt={
    message:'出错了',
    type:"blue lighten-4",
    ...options
  }
  let id = 'message_' + seed++
  instance = new MessageConstructor({
    data: Opt
  })
  instance.id = id
  instance.vm = instance.$mount()
  document.getElementById("app").appendChild(instance.vm.$el)
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  instance.dom.style.zIndex = 10000
  instance.dom.style.top = `${8+instances.length*50}px`
  instances.push(instance)
  setTimeout(()=>{
    Message.close(id)
    Message.reset()
  },2000)
  return instance.vm
}

Message.success = function(message){
	Message({
    color: "",
    type: "primary",
    message
  })
}

Message.error = function(message){
  Message({
    color: "",
    type: "error",
    message
  })
}

Message.normal = function(message){
  Message({
    color: "",
    type: "cyan lighten-4",
    message
  })
}

Message.close = function (id) {
  for (let i = instances.length - 1; i >= 0; i--) {
    if(id===instances[i].id){
      instances[i].close()
      instances.splice(i,1)
      break
    }
  }
}

Message.reset=function(){
  for (let i = 0; i<instances.length; i++) {
    instances[i].vm.$el.style.top=`${8+i*50}px`
  }
}

Message.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

export default Message