import { useEffect } from 'react';

const useScript = (url) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;
    script.type = 'text/javascript';

    document.head.appendChild(script);

    console.log(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

export default useScript;
