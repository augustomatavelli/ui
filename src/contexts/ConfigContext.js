import PropTypes from 'prop-types';
import { createContext, useCallback, useMemo } from 'react';

// project import
import config from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// initial state
const initialState = {
  ...config,
  onChangeContainer: () => {},
  onChangeLocalization: () => {},
  onChangeMode: () => {},
  onChangePresetColor: () => {},
  onChangeDirection: () => {},
  onChangeMiniDrawer: () => {},
  onChangeMenuOrientation: () => {},
  onChangeFontFamily: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

function ConfigProvider({ children }) {
  const [config, setConfig] = useLocalStorage('mantis-react-js-config', initialState);

  const onChangeContainer = useCallback(() => {
    setConfig({
      ...config,
      container: !config.container
    });
  }, [config, setConfig]);

  const onChangeLocalization = useCallback((lang) => {
    setConfig({
      ...config,
      i18n: lang
    });
  }, [config, setConfig]);

  const onChangeMode = useCallback((mode) => {
    setConfig({
      ...config,
      mode
    });
  }, [config, setConfig]);

  const onChangePresetColor = useCallback((theme) => {
    setConfig({
      ...config,
      presetColor: theme
    });
  }, [config, setConfig]);

  const onChangeDirection = useCallback((direction) => {
    setConfig({
      ...config,
      themeDirection: direction
    });
  }, [config, setConfig]);

  const onChangeMiniDrawer = useCallback((miniDrawer) => {
    setConfig({
      ...config,
      miniDrawer
    });
  }, [config, setConfig]);

  const onChangeMenuOrientation = useCallback((layout) => {
    setConfig({
      ...config,
      menuOrientation: layout
    });
  }, [config, setConfig]);

  const onChangeFontFamily = useCallback((fontFamily) => {
    setConfig({
      ...config,
      fontFamily
    });
  }, [config, setConfig]);

  const contextValue = useMemo(
    () => ({
      ...config,
      onChangeContainer,
      onChangeLocalization,
      onChangeMode,
      onChangePresetColor,
      onChangeDirection,
      onChangeMiniDrawer,
      onChangeMenuOrientation,
      onChangeFontFamily
    }),
    [
      config,
      onChangeContainer,
      onChangeLocalization,
      onChangeMode,
      onChangePresetColor,
      onChangeDirection,
      onChangeMiniDrawer,
      onChangeMenuOrientation,
      onChangeFontFamily
    ]
  );

  return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>;
}

ConfigProvider.propTypes = {
  children: PropTypes.node
};

export { ConfigProvider, ConfigContext };
