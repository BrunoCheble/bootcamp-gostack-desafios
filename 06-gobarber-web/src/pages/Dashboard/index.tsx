import React, {useState} from 'react';
import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment, Section, Appointment } from './styles';
import { useAuth } from '../../hooks/auth';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';

const Dashboard: React.FC = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const { signOut, user } = useAuth();

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>
          <button onClick={signOut} type="button"><FiPower /></button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 18</span>
            <span>Segunda-feira</span>
          </p>
          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src="https://avatars1.githubusercontent.com/u/5677802?s=460&u=45628f8eaef21432d343000d9665472aad2e93bf&v=4" alt="Bruno Cheble"/>
              <strong>Bruno Cheble</strong>
              <span>
                <FiClock />
                13:00
              </span>
            </div>
          </NextAppointment>
          <Section>
            <strong>Manhã</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src="https://avatars1.githubusercontent.com/u/5677802?s=460&u=45628f8eaef21432d343000d9665472aad2e93bf&v=4" alt="Bruno Cheble"/>
                <strong>Bruno Cheble</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                09:00
              </span>
              <div>
                <img src="https://avatars1.githubusercontent.com/u/5677802?s=460&u=45628f8eaef21432d343000d9665472aad2e93bf&v=4" alt="Bruno Cheble"/>
                <strong>Bruno Cheble</strong>
              </div>
            </Appointment>

          </Section>
          <Section>
            <strong>Tarde</strong>

            <Appointment>
              <span>
                <FiClock />
                13:00
              </span>
              <div>
                <img src="https://avatars1.githubusercontent.com/u/5677802?s=460&u=45628f8eaef21432d343000d9665472aad2e93bf&v=4" alt="Bruno Cheble"/>
                <strong>Bruno Cheble</strong>
              </div>
            </Appointment>

          </Section>
        </Schedule>
        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
