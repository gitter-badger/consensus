module consensus {
  export class TimedPlayer implements Player {
    private fakeProgressPromise:angular.IPromise<any>;

    static $inject = ['$timeout', '$interval', 'syncedTime', 'playState'];

    constructor(private $timeout:angular.ITimeoutService,
                private $interval:angular.IIntervalService,
                private syncedTime:SyncedTime,
                private playState:PlayerState) {

    }

    public stop():void {
      this.$interval.cancel(this.fakeProgressPromise);
    }

    public play(playCounter:number, url:string, start:number, duration:number):void {
      this.$timeout(() => {
        this.fakeProgressPromise = this.$interval(() => this.playState.ifCurrent(playCounter, () => {
          var progressPercent = (this.syncedTime.now() - start) / duration;
          this.playState.progress = Math.min(Math.floor(progressPercent * 100), 100);
        }), 500);
      }, start - this.syncedTime.now(), false);
    }
  }
}
