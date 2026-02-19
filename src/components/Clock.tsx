import { useState, useEffect } from 'preact/hooks';

export default function Clock() {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hh}:${mm}:${ss}`);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <div class="televisor-clock">{time}</div>;
}
