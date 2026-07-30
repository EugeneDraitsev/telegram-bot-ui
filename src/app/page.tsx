import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`
const Content = styled.div`
  width: 500px;
  max-width: 100vw;
  padding: 20px;
`
const Command = styled.span`
  display: inline-block;
  font-weight: bold;
`

const IndexPage = () => {
  return (
    <Wrapper>
      <Content>
        <h4 className="text-md font-bold my-4">
          Hi, I&apos;m a Telegram chat bot.
        </h4>
        <p className="my-2">
          Add the bot to your chat and invoke the <Command>/s</Command> command
          in Telegram to get a private statistics link.
        </p>
        <p className="my-2">
          Links expire automatically and only grant access to the chat they
          were created for.
        </p>
      </Content>
    </Wrapper>
  )
}

export default IndexPage
