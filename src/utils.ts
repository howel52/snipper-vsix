import axios from 'axios';

export const request = (url) => axios.get(url).then(res => res.data);

export const logger = {
  log: (...args) => {
    return console.log("[Snipper]", ...args)
  }
}

