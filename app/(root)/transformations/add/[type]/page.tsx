import Header from '@/components/shared/Header';
import { transformationTypes } from '@/constants';

const AddTransformationTypePage = async (props: { params: Promise<{ id: string; type: TransformationTypeKey }> }) => {
  
  const { id, type } = await props.params;

  const transformation = transformationTypes[type];

  return (
    <Header 
      title={transformation?.title || "Default Title"}
      subtitle={transformation?.subTitle || "Default Subtitle"}
    />
  );
};

export default AddTransformationTypePage;