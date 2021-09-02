# Claro Select Component

## Usage

````html 
<claro-select
  [value] = "value"
  [disabled] = "true | false"
  [placeholder] = "placeholder text"
  [options] = "Options[]"
  [size] = "'md'"
  [isObject] = false | true
  (valueChanged) = "onValueChange()"
  (elementBlurred) = "onblurAction()"
  classes = "string[]" 
></claro-select>
````

````typescript
interface Options {
  value: string;
  label: string;
}
````