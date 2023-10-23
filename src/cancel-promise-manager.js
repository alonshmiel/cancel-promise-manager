const CancelPromiseManagerEnum = {
    STATE: Object.freeze({
      CANCELED: "CPM_CANCELED",
    }),
  };
  
  class CancelPromiseManager {
    constructor({ isManagerEnabled, onCancelAllPromises }) {
      this.promisesData = [];
      this.isCancellingPromises = false;
  
      this.isManagerEnabled = isManagerEnabled;
      this.onCancelAllPromises = onCancelAllPromises;
    }
  
    addPromise({ promiseFunc, onCancel = () => {}, props = {} }) {
      if (!this.isManagerEnabled) {
        return promiseFunc();
      }
      if (this.isCancellingPromises) {
        return Promise.resolve(CancelPromiseManagerEnum.STATE.CANCELED);
      } else {
        const promise = promiseFunc();
        this.promisesData.push({ promise, onCancel, props });
        return promise.catch((ex) => {
          this.cancelAllPromises({ rejectedPromiseData: { promise, onCancel, props } });
        });
      }
    }
  
    async waitingForResolvedPromises() {
      // wait for all promises: resolved and rejected
      const allPromises = await Promise.allSettled(this.promisesData.map((data) => data.promise));
  
      // get indices of resolved promises, rejected promises are -1 and will be filtered out
      const resolvedPromisesIndices = allPromises
        .map((o, index) => (o.status === "fulfilled" ? index : -1))
        .filter((index) => index !== -1);
  
      const byKeepingResolveIndices = (data, index) => resolvedPromisesIndices.includes(index);
      const toResultData = async (promiseData) => {
        const { promise, ...rest } = promiseData;
        return {
          result: await promise,
          ...rest,
        };
      };
      // filter all the promises by succeeded ones (the indices from the prev step)
      return await Promise.all(this.promisesData.filter(byKeepingResolveIndices).map(toResultData));
    }
  
    async cancelAllPromises({ rejectedPromiseData }) {
      if (!this.isManagerEnabled || this.isCancellingPromises || !this.promisesData.length) {
        return;
      }
      // mark as canceling. New promises will not be added.
      this.isCancellingPromises = true;
  
      const resolvedPromisesData = await this.waitingForResolvedPromises();
  
      // resolved promises are [{result, onCancel, props}]
      await this.onCancelAllPromises({ resolvedPromisesData, rejectedPromiseData });
  
      this.promisesData = [];
      this.isCancellingPromises = false;
    }
  }
  
  module.exports = { CancelPromiseManager, CancelPromiseManagerEnum };
  