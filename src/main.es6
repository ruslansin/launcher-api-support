import {
    CategoryStore,
    FocusedPerspectiveStore,
    ThreadCountsStore
} from 'mailspring-exports';
import dbus from 'dbus-native';

export class LauncherAPIUpdater {
    constructor(needUpdate) {
        this.unlisteners = [
            FocusedPerspectiveStore.listen(this._updateBadges, this),
            ThreadCountsStore.listen(this._updateBadges, this)
        ];

        this._onValueChanged = AppEnv.config.onDidChange('core.notifications.countBadge', ({
            newValue
        }) => {
            if (newValue === 'hide') {
                this._hideBadges();
            }
            this._updateBadges(newValue);
        });

        if (needUpdate) {
            this._updateBadges(this._getPref());
        }
    }

    unlisten() {
        this._hideBadges();
        for (const unlisten of this.unlisteners) {
            unlisten();
        }
        this._onValueChanged.dispose();
    }

    _getStats() {
        let unread = 0,
            total = 0;

        // unread messages depend on a focused mailbox
        let accountIds = FocusedPerspectiveStore.current().accountIds;
        for (let c of CategoryStore.getCategoriesWithRoles(accountIds, 'inbox')) {
            unread += ThreadCountsStore.unreadCountForCategoryId(c.id);
            total += ThreadCountsStore.totalCountForCategoryId(c.id);
        }

        return [unread, total];
    }

    _getPref() {
        return AppEnv.config.get('core.notifications.countBadge');
    }

    _updateBadges(mode) {
        if (mode === undefined) {
            mode = this._getPref();
        }

        if (mode === 'hide') {
            return;
        }

        let [unread, total] = this._getStats();

        let count = mode === 'unread' ? unread : total;

        this._updateCounter(count);
    }

    _hideBadges() {
        this._updateCounter(0);
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
