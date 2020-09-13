import React from 'react';

const ref = React.createRef<HTMLIFrameElement>();

export interface TheiaProject {
  name: string,
  path: string,
  folders: string[],
}

export interface TheiaState {
  ref: React.RefObject<HTMLIFrameElement>,
  theiaIsReady: boolean,
  openProjectInTheia: (theiaProject: TheiaProject) => void,
  openFileInTheia: (file: string) => void,
  sendTheiaMessage: (msg: any) => void,
}

export const TheiaContext = React.createContext<TheiaState>({
  ref,
  theiaIsReady: false,
  openProjectInTheia: () => { console.error('Theia is not initialized yet') },
  openFileInTheia: () => { console.error('Theia is not initialized yet') },
  sendTheiaMessage: () => { console.error('Theia is not initialized yet') },
});

export const TheiaContextProvider = React.memo(({ children }) => {
  const [theiaIsReady, setTheiaIsReady] = React.useState(false);

  const sendTheiaMessage = React.useCallback((message: any) => {
    if (ref.current !== null) {
      (ref.current as any).contentWindow.postMessage(message, '*');
    }
  }, []);

  const openProjectInTheia = React.useCallback((theiaProject: TheiaProject) => {
    sendTheiaMessage({
      type: 'fxdk:setProject',
      data: theiaProject,
    });
  }, [sendTheiaMessage]);

  const openFileInTheia = React.useCallback((file: string) => {
    sendTheiaMessage({
      type: 'fxdk:openFile',
      data: file,
    });
  }, [sendTheiaMessage]);

  React.useEffect(() => {
    const handler = (e: MessageEvent) => {
      switch (e.data.type) {
        case 'theia:ready': {
          console.log('Theia is ready!');
          return setTheiaIsReady(true);
        }
        case 'theia:notReady': {
          console.log('Theia is not ready');
          return setTheiaIsReady(false);
        }
      }
    }

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, []);

  const value = {
    ref,
    theiaIsReady,
    sendTheiaMessage,
    openProjectInTheia,
    openFileInTheia,
  };

  return (
    <TheiaContext.Provider value={value}>
      {children}
    </TheiaContext.Provider>
  );
});
