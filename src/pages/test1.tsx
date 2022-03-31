import { Display, ViewContainer } from '@impact-market/ui';
import { useRouter } from 'next/router';

const Test = () => {
  const router = useRouter();

  return (
    <ViewContainer isLoading={false}>
      <Display>
        Test page 1
      </Display>
      <br/><br />
      <div onClick={() => router.push('/')}>Go to Home</div>
      <br /><br />
      <div onClick={() => router.push('/test2')}>Go to Test2</div>
    </ViewContainer>
  );
}

export default Test;
