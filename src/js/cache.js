

/**
 * cache all api requests around one reload page 
 * this cached data will destroy every new requests
 */


const cache = {
    stale: 0,
    data: {},
    get(key) {
        let diff = Math.floor( ( (Date.now() - this.data[key]?.date ) /1000 ) % 1000);
        if(this.data[key] && diff <= this.stale) return this.data[key].data;
    },
    set(key, value){
        this.data[key] = {
            data: value,
            date: Date.now(),
        }
    },
    setStale(secounds){
        this.stale = secounds;
    }
}

export default cache;