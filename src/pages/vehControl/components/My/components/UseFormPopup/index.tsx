import Popup, { IPopupProps } from '@/components/Popup';
import FormInput from '@/components/FormInput';
import AvatarInput from '@/components/AvatarInput';
import VerificationCodeInput from '@/components/VerificationCodeInput';
import { Icon, Button } from '@nutui/nutui-react-taro';
import Form from '@/components/Form';
import './index.scss';
import { FormInstance } from '@/components/Form/FormInstance';
import { userUpdate } from '@/api/user';
import { filterObject } from '@/utils/object';
import Taro from '@tarojs/taro';
import { uploadAvatar } from '@/api/file';
import { loginSendChangeMessage } from '@/api/login';
import AddFriend from '@/components/AddFriend';

interface IUserFormPopupProps extends IPopupProps {
  form: FormInstance;
  onAvartarUpdate?: () => void;
}
const UserFormPopup = ({
  visible,
  form,
  onAvartarUpdate,
  onClose,
  ...props
}: IUserFormPopupProps) => {
  const rules = {
    userName: [
      {
        required: true,
        message: '请输入用户名称',
      },
      {
        maxLength: 25,
        message: '用户名不能超过25个字符',
      },
    ],
    userDesc: [
      {
        maxLength: 48,
        message: '介绍不能超过48个字符',
      },
    ],
    phone: [
      {
        type: 'phone',
        message: '手机号格式不正确',
      },
    ],
    code: [
      {
        validator: (val) => {
          const phone = form.getFieldValue('phone');
          if (phone && !val) {
            return new Error('请输入验证码');
          }
        },
      },
    ],
  };
  return (
    <Popup
      visible={visible}
      onClose={onClose}
      className="user-form-popup"
      title="设置资料"
      height="82%"
      lockScroll={false}
      {...props}
    >
      <Form
        rules={rules}
        form={form}
        onFormSubmit={(values) => {
          Taro.showLoading();
          userUpdate(filterObject(values) as any).then(() => {
            Taro.showToast({
              title: '修改成功',
              icon: 'success',
            });
            form.clearFields();
            onClose &&
              onClose({
                changeForm: true,
              });
          });
        }}
        className="user-popup-form"
      >
        <Form.Item field="userName">
          <FormInput placeholder="请输入名字" />
        </Form.Item>
        <Form.Item field="userDesc">
          <FormInput placeholder="请输入一句话介绍" textarea />
        </Form.Item>
        <Form.Item>
          <AvatarInput
            onChange={(filePath) => {
              uploadAvatar({
                filePath: filePath,
              }).then(() => {
                Taro.showToast({
                  title: '头像修改成功',
                  icon: 'success',
                });
                onAvartarUpdate && onAvartarUpdate();
              });
            }}
          />
        </Form.Item>
        <Form.Item field="phone">
          <VerificationCodeInput
            onInput={(e) => {
              if (!e.detail.value) {
                form.clearFields(['code']);
              }
            }}
            onSubmit={() => {
              const errors = form.validate(['phone']);
              if (errors.length) return Promise.reject();
              if (!form.getFieldValue('phone')) {
                Taro.showToast({
                  title: '请输入手机号',
                  icon: 'error',
                });
                return Promise.reject();
              }
              Taro.showLoading({
                title: '正在发送验证码',
              });
              return loginSendChangeMessage({
                phone: form.getFieldValue('phone'),
              }).then(() => {
                Taro.showToast({
                  title: '验证码发送成功',
                  icon: 'success',
                });
              });
            }}
            placeholder="请输入更换的手机号"
          />
        </Form.Item>
        <Form.Item field="code">
          <FormInput type="digit" placeholder="请输入验证码" />
        </Form.Item>

        <div className="divider"></div>
        <AddFriend
          text="客服中心"
          showDivider={false}
          icon={
            <Icon className="customer-service-icon" name="triangle-up" />
          }
          className={'customer-service'}
        />
        {/* <div className="customer-service">
          <span>客服中心</span>
          
        </div> */}
        <div className="footer">
          <Button size="large" block type="primary" formType="submit">
            保 存
          </Button>
        </div>
      </Form>
    </Popup>
  );
};

export default UserFormPopup;
