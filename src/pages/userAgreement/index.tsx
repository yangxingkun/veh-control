import './index.scss';
import bannerJPG from '@/assets/useAgreement-banner.jpeg';
import { userAgreementData, privacyData } from './data';
import { Fragment } from 'react';
import HTMlView from './HtmlView';
import { useRouter } from '@tarojs/taro';

const UserAgreement = () => {
  const router = useRouter();
  const data = router.params.type === 'userAgreement' ? userAgreementData : privacyData;
  return (
    <div className="user-agreement-page">
      <div className="header">
        <img className="header-banner" src={bannerJPG} />
        <div className="header-title">{data.title}</div>
      </div>
      <div className="top-content">
        <div className="top-item">更新时间：{data.updateTime}</div>
        <div className="top-item">生效时间：{data.validTime}</div>
      </div>
      <div className="acticle">
        <HTMlView className="desc" content={data.desc} />
        {data.contents.map((item, index) => {
          return (
            <Fragment key={index}>
              <div className="acticle-title">{item.title}</div>
              <div className="acticle-paragraph">
                {item.paragraphs.map((paragraph, paragraphIndex) => {
                  if (router.params.type !== 'userAgreement') {
                    return (
                      <HTMlView
                        key={paragraphIndex}
                        className="acticle-paragraph-item"
                        content={`${paragraph}`}
                      />
                    );
                  }
                  if (typeof paragraph === 'string') {
                    return (
                      <HTMlView
                        key={paragraphIndex}
                        className="acticle-paragraph-item"
                        content={`${index + 1}.${
                          paragraphIndex + 1
                        } ${paragraph}`}
                      />
                    );
                  }
                  const pAttrs = [
                    <HTMlView
                      key={paragraphIndex}
                      className="acticle-paragraph-item"
                      content={`${index + 1}.${paragraphIndex + 1} ${
                        paragraph.title
                      }`}
                    />,
                  ];
                  paragraph.contents.forEach((item, subIndex) => {
                    pAttrs.push(
                      <HTMlView
                        key={`${paragraphIndex}-${subIndex}`}
                        className="acticle-paragraph-item"
                        content={`${index + 1}.${paragraphIndex + 1}.${
                          subIndex + 1
                        } ${item}`}
                      />
                    );
                  });
                  return pAttrs;
                })}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default UserAgreement;
