// REMOVED: Socket and CUB cloud sync - now local-only storage
// This file previously managed cloud storage synchronization via WebSocket and CUB API
// Now replaced with local-only stubs

import Utils from './math'
import Storage from './storage'
import Arrays from './arrays'
// REMOVED: import Account - CUB account system removed

class WorkerArray{
    constructor(field){
        this.field  = field
        this.empty  = []
        this.data   = []
        this.limit  = 3000
        this.loaded = false
    }

    init(class_type){
        this.class_type = class_type

        console.log('StorageWorker', this.field, 'local-only mode (no cloud sync)')

        Storage.listener.follow('change',(e)=>{
            if(this.field == e.name && this.loaded){
                try{
                    this.save(e.value)
                }
                catch(e){
                    console.log('StorageWorker',this.field,e.message)
                }
            }
        })

        this.update()

        // No longer needs periodic cloud sync
    }

    restrict(result){
        if(Arrays.isObject(result)){
            let keys = Arrays.getKeys(result)

            if(keys.length > this.limit){
                let remv = keys.slice(0, keys.length - this.limit)

                remv.forEach(k=>{
                    delete result[k]
                })
            }
        }
        else if(result.length > this.limit){
            result = result.slice(result.length - this.limit)
        }

        return result
    }

    parse(from, nolisten){
        let to = Storage.cache(this.field, this.limit, Arrays.clone(this.empty))

        this.filter(from, to)

        Storage.set(this.field, to, nolisten)

        this.data = this.restrict(Arrays.decodeJson(localStorage.getItem(this.field),Arrays.clone(this.empty)))

        Lampa.Listener.send('worker_storage',{type:'insert', name:this.field, from, to})
    }

    filter(from, to){
        from.forEach(a=>{
            if(to.indexOf(a) == -1) to.push(a)
        })
    }

    update(full, nolisten){
        // REMOVED: Cloud sync - no longer fetches from CUB API
        // Just load from local storage
        this.data = this.restrict(Arrays.decodeJson(localStorage.getItem(this.field),Arrays.clone(this.empty)))
        this.loaded = true

        console.log('StorageWorker',this.field,'loaded from local storage')
    }

    // REMOVED: removeFromSocket(data) - socket sync removed
    // REMOVED: updateFromSocket(data) - socket sync removed

    send(id,value){
        // REMOVED: Socket.send - no cloud sync
        console.log('StorageWorker','local save:',this.field, id,value)
    }

    sendRemove(id,value){
        // REMOVED: Socket.send - no cloud sync
        console.log('StorageWorker','local remove:',this.field, id,value)
    }

    sendClean(){
        // REMOVED: Socket.send - no cloud sync
        console.log('StorageWorker','local clean:',this.field)
    }

    save(value){
        let uniq = value.filter(a=>this.data.indexOf(a) == -1)

        uniq.forEach(val=>{
            this.data.push(val)
            // No cloud send
        })
    }

    remove(value){
        Arrays.remove(this.data, value)
        // No cloud send
    }

    clean(){
        this.data = []
        // No cloud send
    }
}

class WorkerFilterID extends WorkerArray {
    filter(from, to) {
        from.forEach(a=>{
            let find = to.find(b=>b.id == a.id)

            if(!find) to.push(a)
            else{
                to[to.indexOf(find)] = a
            }
        })
    }

    // REMOVED: removeFromSocket(data) - socket sync removed
    // REMOVED: updateFromSocket(data) - socket sync removed

    save(value){
        let uniq = []

        value.forEach(val=>{
            let find = this.data.find(a=>a.id == val.id)

            if(!find){
                this.data.push(typeof val == 'object' ? Arrays.clone(val) : val)
                uniq.push(val)
            }
            else if(JSON.stringify(val) !== JSON.stringify(find)){
                this.data[this.data.indexOf(find)] = typeof val == 'object' ? Arrays.clone(val) : val
                uniq.push(val)
            }
        })

        // No cloud send
    }

    remove(id){
        let find = this.data.find(a=>a.id == id)

        if(find) Arrays.remove(this.data, find)

        // No cloud send
    }
}

class WorkerObject extends WorkerArray {
    constructor(params){
        super(params)

        this.data  = {}
        this.empty = {}
    }

    filter(from, to) {
        for(let id in from){
            to[id] = from[id]
        }
    }

    // REMOVED: removeFromSocket(data) - socket sync removed
    // REMOVED: updateFromSocket(data) - socket sync removed

    save(value){
        let uniq = []

        for(let id in value){
            let a = value[id]
            let b = this.data[id]

            if(!this.data[id]){
                this.data[id] = typeof a == 'object' ? Arrays.clone(a) : a
                uniq.push(id)
            }
            else{
                a = JSON.stringify(a)
                b = JSON.stringify(b)

                if(a !== b){
                    this.data[id] = typeof value[id] == 'object' ? Arrays.clone(value[id]) : value[id]
                    uniq.push(id)
                }
            }
        }

        // No cloud send
    }

    remove(id){
        delete this.data[id]
        // No cloud send
    }

    clean(){
        this.data = {}
        // No cloud send
    }
}

export default {
    //['string',0499383]
    array_string: WorkerArray,

    //[{'id':'049994',...}]
    array_object_id: WorkerFilterID,

    //{'id048994':{...}, ...}
    object_object: WorkerObject,

    //{'id399884':'string', ...}
    object_string: WorkerObject
}
