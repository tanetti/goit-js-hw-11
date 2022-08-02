import '../sass/index.scss';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { refs } from './refs/refs';
import { setSettingsValues } from './settings/set-settings-values';
import * as settingsActions from './settings/settings-actions';
import { onFormSubmit } from './form-submit/form-submit';
import { onScrollToTopButtonClick } from './scroll-to-top/scroll-to-top';

Notify.init({
  position: 'center-bottom',
  distance: '20px',
  borderRadius: '14px',
  timeout: 5000,
  clickToClose: true,
  cssAnimationStyle: 'from-bottom',
});

Aos.init();

setSettingsValues();

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.searchFormSettingsButton.addEventListener('click', settingsActions.onSearchFormSettingsButtonClick);
refs.orientationSwitch.addEventListener('click', settingsActions.onOrientationSwitchClick);
refs.perPageField.addEventListener('focus', ({ currentTarget }) => currentTarget.select());
refs.perPageField.addEventListener('input', debounce(settingsActions.onPerPageFieldInput, 1000));
refs.safeSearchCheckbox.addEventListener('change', settingsActions.onSafeSearchCheckboxChange);
refs.scrollToTopButton.addEventListener('click', onScrollToTopButtonClick);
