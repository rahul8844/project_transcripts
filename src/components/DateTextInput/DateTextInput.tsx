import React, {useMemo, useState} from 'react';
import {Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import VoiceTextInput from '../VoiceTextInput/VoiceTextInput';

interface DateTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
}

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

const isValidYmd = (y: number, m: number, d: number) => {
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
};

const monthMap: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

const toYmd = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const parseDateString = (input: string): string | null => {
  const s = input.trim().toLowerCase().replace(/[,\.]/g, ' ');
  if (!s) {
    return null;
  }

  if (s === 'today') {
    return toYmd(new Date());
  }
  if (s === 'tomorrow') {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toYmd(d);
  }

  // yyyy-mm-dd or yyyy/mm/dd
  let m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const da = Number(m[3]);
    if (isValidYmd(y, mo, da)) {
      return `${y}-${pad2(mo)}-${pad2(da)}`;
    }
  }

  // dd-mm-yyyy or dd/mm/yyyy or dd mm yyyy
  m = s.match(/^(\d{1,2})[\-\/\s](\d{1,2})[\-\/\s](\d{4})$/);
  if (m) {
    const da = Number(m[1]);
    const mo = Number(m[2]);
    const y = Number(m[3]);
    if (isValidYmd(y, mo, da)) {
      return `${y}-${pad2(mo)}-${pad2(da)}`;
    }
  }

  // dd Month yyyy (english months)
  m = s.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (m) {
    const da = Number(m[1]);
    const moName = m[2].toLowerCase();
    const y = Number(m[3]);
    const mo = monthMap[moName];
    if (mo && isValidYmd(y, mo, da)) {
      return `${y}-${pad2(mo)}-${pad2(da)}`;
    }
  }

  // Fallback to Date.parse
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) {
    return toYmd(parsed);
  }
  return null;
};

const DateTextInput: React.FC<DateTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
}) => {
  const [show, setShow] = useState(false);
  const currentDate = useMemo(() => {
    const p = parseDateString(value);
    if (p) {
      const [yy, mm, dd] = p.split('-').map(n => Number(n));
      return new Date(yy, mm - 1, dd);
    }
    return new Date();
  }, [value]);

  const handleVoiceText = (text: string) => {
    const parsed = parseDateString(text);
    if (parsed) {
      onChangeText(parsed);
    } else {
      onChangeText(text);
    }
  };

  const onPickerChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selected) {
      onChangeText(toYmd(selected));
    }
  };

  return (
    <>
      <VoiceTextInput
        style={style}
        placeholder={placeholder}
        value={value}
        onChangeText={handleVoiceText}
        onFocus={() => setShow(true)}
        editable={true}
      />
      {show && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.select({ios: 'inline', android: 'default'})}
          onChange={onPickerChange}
        />
      )}
    </>
  );
};

export default DateTextInput;
