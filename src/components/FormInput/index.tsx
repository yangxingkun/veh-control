import { Input, Textarea, InputProps } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';
import './index.scss';

export interface IFormInputProps extends InputProps {
  showMargin?: boolean;
  textarea?: boolean;
  suffix?: ReactNode;
}
const FormInput = ({
  showMargin = true,
  textarea,
  suffix,
  type = 'text',
  ...props
}: IFormInputProps) => {
  return (
    <div
      className={classNames(
        'form-input-container',
        showMargin && 'form-input-container-margin-bottom',
        suffix !== undefined && 'form-input-container-has-suffix'
      )}
    >
      {textarea ? (
        // @ts-ignore
        <Textarea
          {...props}
          placeholderClass="form-input-placeholder"
          className="form-textarea form-input"
        />
      ) : (
        <Input
          {...props}
          type={type}
          placeholderClass="form-input-placeholder"
          className="form-input"
        />
      )}
      {suffix && <div className="form-input-sufix">{suffix}</div>}
    </div>
  );
};

export default FormInput;
