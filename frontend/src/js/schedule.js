const ACTIVE_CLASS = 'is-active';
const ENHANCED_CLASS = 'ossm-schedule-wrap--enhanced';
const TAB_CLASS = 'ossm-schedule-tab';
const DAY_CLASS = 'ossm-schedule-day';
const ITEM_CLASS = 'ossm-schedule-item';
const SUMMARY_CLASS = 'ossm-schedule-summary';
const BODY_CLASS = 'ossm-schedule-body';
const SPLIT_ROW_CLASS = 'ossm-schedule-row--split';
const SPLIT_ROW_OPEN_CLASS = 'ossm-schedule-row--split--has-open';
const ASYMMETRIC_ROW_CLASS = 'ossm-schedule-row--asymmetric';
const ASYMMETRIC_LEFT_CLASS = 'ossm-schedule-item--asymmetric-left';
const ASYMMETRIC_COLUMN_CLASS = 'ossm-schedule-asymmetric-column';
const TAB_PREFIX = 'ossm-schedule-tab--';
const DAY_PREFIX = 'ossm-schedule-day--';

function getDayKeyFromTab(tab) {
    const href = tab.getAttribute('href') || '';

    if (href.indexOf('#ossm-day-') === 0) {
        return href.replace('#ossm-day-', '');
    }

    const tabClass = Array.from(tab.classList).find((className) => className.indexOf(TAB_PREFIX) === 0);
    return tabClass ? tabClass.replace(TAB_PREFIX, '') : '';
}

function setActiveDay(wrap, dayKey) {
    if (!dayKey) {
        return;
    }

    wrap.querySelectorAll(`.${TAB_CLASS}`).forEach((tab) => {
        tab.classList.toggle(ACTIVE_CLASS, getDayKeyFromTab(tab) === dayKey);
    });

    wrap.querySelectorAll(`.${DAY_CLASS}`).forEach((day) => {
        day.classList.toggle(ACTIVE_CLASS, day.classList.contains(`${DAY_PREFIX}${dayKey}`));
    });
}

function clearScheduleHash() {
    if (!window.history || typeof window.history.replaceState !== 'function') {
        return;
    }

    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, document.title, cleanUrl);
}

function initTabs(wrap) {
    const tabs = Array.from(wrap.querySelectorAll(`.${TAB_CLASS}`));

    if (!tabs.length) {
        return;
    }

    const hash = window.location.hash || '';
    const hashTab = tabs.find((tab) => tab.getAttribute('href') === hash);
    const defaultTab = tabs.find((tab) => tab.classList.contains(ACTIVE_CLASS)) || tabs[0];
    const initialTab = hashTab || defaultTab;
    const initialDayKey = getDayKeyFromTab(initialTab);

    setActiveDay(wrap, initialDayKey);
    updateAsymmetricRows(wrap);
    wrap.classList.add(ENHANCED_CLASS);

    if (hashTab) {
        clearScheduleHash();
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', (event) => {
            const currentTab = wrap.querySelector(`.${TAB_CLASS}.${ACTIVE_CLASS}`) || defaultTab;
            const currentDayKey = getDayKeyFromTab(currentTab);
            const nextDayKey = getDayKeyFromTab(tab);

            event.preventDefault();

            if (currentDayKey !== nextDayKey) {
                collapseAllItems(wrap);
            }

            setActiveDay(wrap, nextDayKey);
            updateAsymmetricRows(wrap);
        });
    });
}

function clearAnimatedStyles(body) {
    body.style.height = '';
    body.style.opacity = '';
    body.style.overflow = '';
    body.style.paddingTop = '';
    body.style.paddingBottom = '';
}

function closeItemImmediately(details, body) {
    details.open = false;
    details.dataset.animating = 'false';
    clearAnimatedStyles(body);
    updateSplitRowState(details);
}

function collapseAllItems(wrap) {
    wrap.querySelectorAll(`.${ITEM_CLASS}`).forEach((details) => {
        const body = details.querySelector(`.${BODY_CLASS}`);

        if (!body || !details.open) {
            return;
        }

        closeItemImmediately(details, body);
    });
}

function updateSplitRowState(details) {
    const splitRow = details.closest(`.${SPLIT_ROW_CLASS}`);

    if (!splitRow) {
        return;
    }

    const hasOpenItem = Array.from(splitRow.querySelectorAll(`.${ITEM_CLASS}`)).some((item) => item.open);
    splitRow.classList.toggle(SPLIT_ROW_OPEN_CLASS, hasOpenItem);
}

function updateAsymmetricRowState(row) {
    const leftItem = row.querySelector(`.${ASYMMETRIC_LEFT_CLASS}`);
    const rightColumn = row.querySelector(`.${ASYMMETRIC_COLUMN_CLASS}`);

    if (!leftItem || !rightColumn || row.offsetParent === null) {
        return;
    }

    if (window.matchMedia('(max-width: 736px)').matches) {
        leftItem.style.minHeight = '';
        return;
    }

    const rightItems = Array.from(rightColumn.querySelectorAll(`.${ITEM_CLASS}`));
    const columnStyle = window.getComputedStyle(rightColumn);
    const gapValue = columnStyle.rowGap !== 'normal' ? columnStyle.rowGap : columnStyle.gap;
    const gap = Number.parseFloat(gapValue) || 0;
    const baseHeight = rightItems.reduce((height, item) => {
        const summary = item.querySelector(`.${SUMMARY_CLASS}`);

        if (!summary) {
            return height;
        }

        const itemStyle = window.getComputedStyle(item);
        const borderTop = Number.parseFloat(itemStyle.borderTopWidth) || 0;
        const borderBottom = Number.parseFloat(itemStyle.borderBottomWidth) || 0;
        return height + summary.offsetHeight + borderTop + borderBottom;
    }, 0) + Math.max(0, rightItems.length - 1) * gap;

    leftItem.style.minHeight = `${Math.ceil(baseHeight)}px`;
}

function updateAsymmetricRows(wrap) {
    wrap.querySelectorAll(`.${ASYMMETRIC_ROW_CLASS}`).forEach((row) => {
        updateAsymmetricRowState(row);
    });
}

function isInteractiveTarget(target) {
    return Boolean(target.closest('a, button, input, textarea, select, label'));
}

function openItem(details, body, reduceMotion) {
    if (details.open) {
        return;
    }

    if (reduceMotion) {
        details.open = true;
        updateSplitRowState(details);
        return;
    }

    details.open = true;
    updateSplitRowState(details);
    expandItem(details, body);
}

function closeItem(details, body, reduceMotion) {
    if (!details.open) {
        return;
    }

    if (reduceMotion) {
        details.open = false;
        updateSplitRowState(details);
        return;
    }

    collapseItem(details, body);
}

function expandItem(details, body) {
    const computedStyle = window.getComputedStyle(body);
    const targetHeight = `${body.scrollHeight}px`;

    details.dataset.animating = 'true';
    body.style.overflow = 'hidden';
    body.style.height = '0px';
    body.style.opacity = '0';
    body.style.paddingTop = '0px';
    body.style.paddingBottom = '0px';

    body.getBoundingClientRect();

    body.style.height = targetHeight;
    body.style.opacity = '1';
    body.style.paddingTop = computedStyle.paddingTop;
    body.style.paddingBottom = computedStyle.paddingBottom;

    const finish = (event) => {
        if (event.target !== body || event.propertyName !== 'height') {
            return;
        }

        body.removeEventListener('transitionend', finish);
        clearAnimatedStyles(body);
        details.dataset.animating = 'false';
    };

    body.addEventListener('transitionend', finish);
}

function collapseItem(details, body) {
    const computedStyle = window.getComputedStyle(body);

    details.dataset.animating = 'true';
    body.style.overflow = 'hidden';
    body.style.height = `${body.offsetHeight}px`;
    body.style.opacity = '1';
    body.style.paddingTop = computedStyle.paddingTop;
    body.style.paddingBottom = computedStyle.paddingBottom;

    body.getBoundingClientRect();

    body.style.height = '0px';
    body.style.opacity = '0';
    body.style.paddingTop = '0px';
    body.style.paddingBottom = '0px';

    const finish = (event) => {
        if (event.target !== body || event.propertyName !== 'height') {
            return;
        }

        body.removeEventListener('transitionend', finish);
        details.open = false;
        clearAnimatedStyles(body);
        details.dataset.animating = 'false';
        updateSplitRowState(details);
    };

    body.addEventListener('transitionend', finish);
}

function initAnimatedItems(wrap) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    wrap.querySelectorAll(`.${ITEM_CLASS}`).forEach((details) => {
        const summary = details.querySelector(`.${SUMMARY_CLASS}`);
        const body = details.querySelector(`.${BODY_CLASS}`);

        if (!summary || !body) {
            return;
        }

        details.dataset.animating = 'false';
        updateSplitRowState(details);

        summary.addEventListener('click', (event) => {
            if (details.dataset.animating === 'true') {
                event.preventDefault();
                return;
            }

            if (reduceMotion) {
                window.requestAnimationFrame(() => updateSplitRowState(details));
                return;
            }

            event.preventDefault();

            if (details.open) {
                closeItem(details, body, reduceMotion);
                return;
            }

            openItem(details, body, reduceMotion);
        });

        details.addEventListener('click', (event) => {
            if (!details.open || details.dataset.animating === 'true' || isInteractiveTarget(event.target)) {
                return;
            }

            if (event.target.closest(`.${SUMMARY_CLASS}`)) {
                return;
            }

            closeItem(details, body, reduceMotion);
        });
    });
}

function initSchedules() {
    const wraps = Array.from(document.querySelectorAll('.ossm-schedule-wrap'));

    wraps.forEach((wrap) => {
        initTabs(wrap);
        initAnimatedItems(wrap);
        window.requestAnimationFrame(() => updateAsymmetricRows(wrap));
    });

    let resizeFrame = null;

    window.addEventListener('resize', () => {
        if (resizeFrame !== null) {
            window.cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = window.requestAnimationFrame(() => {
            wraps.forEach((wrap) => updateAsymmetricRows(wrap));
            resizeFrame = null;
        });
    }, { passive: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSchedules);
} else {
    initSchedules();
}
