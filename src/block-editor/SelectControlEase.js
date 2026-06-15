props => {
  const [selection, setSelection] = useState<string[""]>([]);
  if (props.multiple) {
    return <SelectControl __next40pxDefaultSize {...props} multiple value={selection} onChange={value => {
      setSelection(value);
      props.onChange?.(value);
    }} />;
  }
  return <SelectControl __next40pxDefaultSize {...props} multiple={false} value={selection?.[0]} onChange={value => {
    setSelection([value]);
    props.onChange?.(value);
  }} />;
}