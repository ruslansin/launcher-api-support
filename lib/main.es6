import {
    CategoryStore,
    FocusedPerspectiveStore,
    ThreadCountsStore
} from 'mailspring-exports';
import dbus from 'dbus-native';

export class LauncherAPIUpdater {
    constructor(needUpdate) {
        this.unlisteners = [
            FocusedPerspectiveStore.listen(this._updateUnread, this),
            ThreadCountsStore.listen(this._updateUnread, this)
        ];

        this._latestUnread = 0;

        if (needUpdate) {
            this._updateUnread();
        }
    }

    unlisten() {
        for (const unlisten of this.unlisteners) {
            unlisten();
        }
    }

    _getUnread() {
        let unread = 0;

        // unread messages depend on a focused mailbox
        let accountIds = FocusedPerspectiveStore.current().accountIds;
        for (let c of CategoryStore.getCategoriesWithRoles(accountIds, 'inbox')) {
            unread += ThreadCountsStore.unreadCountForCategoryId(c.id);
        }
        return unread;
    }

    _updateUnread() {
        let newUnread = this._getUnread();

        if (newUnread == this._latestUnread)
            return;

        this._latestUnread = newUnread;
        this._updateCounter(newUnread);
    }

    _updateCounter(count) {
        const APP_URL = "application://mailspring.desktop";
        let sessionBus = dbus.sessionBus();
        sessionBus.sendSignal('/', 'com.canonical.Unity.LauncherEntry', 'Update',
            'sa{sv}', [APP_URL, [
                ['count', ['x', count]],
                ['count-visible', ['b', count > 0]]
            ]]
        );
    }

}

export function activate() {
    this.updater = new LauncherAPIUpdater(true);
}

export function deactivate() {
    this.updater.unlisten();
}
