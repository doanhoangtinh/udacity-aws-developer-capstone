import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createResearchGroup, deleteResearchGroup, getResearchGroups, patchResearchGroup } from '../api/research-groups-api'
import Auth from '../auth/Auth'
import { ResearchGroup } from '../types/ResearchGroup'

interface ResearchGroupsProps {
  auth: Auth
  history: History
}

interface ResearchGroupsState {
  researchGroups: ResearchGroup[]
  newResearchGroupName: string
  newDescription: string
  loadingResearchGroups: boolean
}

export class ResearchGroups extends React.PureComponent<ResearchGroupsProps, ResearchGroupsState> {
  state: ResearchGroupsState = {
    researchGroups: [],
    newResearchGroupName: '',
    newDescription: '',
    loadingResearchGroups: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newResearchGroupName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (researchGroupId: string) => {
    this.props.history.push(`/researchGroups/${researchGroupId}/edit`)
  }

  // onGroupCreate = async () => {
  //   try {
  //     alert('ResearchGroup deletion failed')

  //     console.log("Save" + this.state.newDescription)
  //     // const dueDate = this.calculateDueDate()
  //     // const newResearchGroup = await createResearchGroup(this.props.auth.getIdToken(), {
  //     //   name: this.state.newResearchGroupName,
  //     //   dueDate
  //     // })
  //     // console.log(newResearchGroup)
  //     // this.setState({
  //     //   researchGroups: [...this.state.researchGroups, newResearchGroup],
  //     //   newResearchGroupName: ''
  //     // })
  //   } catch {
  //     alert('ResearchGroup creation failed')
  //   }
  // }

  // onResearchGroupCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
  onResearchGroupCreate = async () => {
    try {
      // const dueDate = this.calculateDueDate()
      const newResearchGroup = await createResearchGroup(this.props.auth.getIdToken(), {
        name: this.state.newResearchGroupName,
        description: this.state.newDescription
      })
      console.log(newResearchGroup)
      this.setState({
        researchGroups: [...this.state.researchGroups, newResearchGroup],
        newResearchGroupName: ''
      })
    } catch {
      alert('ResearchGroup creation failed')
    }
  }

  onResearchGroupDelete = async (researchGroupId: string) => {
    try {
      await deleteResearchGroup(this.props.auth.getIdToken(), researchGroupId)
      this.setState({
        researchGroups: this.state.researchGroups.filter(researchGroup => researchGroup.researchGroupId !== researchGroupId)
      })
    } catch {
      alert('ResearchGroup deletion failed')
    }
  }

  // onResearchGroupCheck = async (pos: number) => {
  //   try {
  //     const researchGroup = this.state.researchGroups[pos]
  //     await patchResearchGroup(this.props.auth.getIdToken(), researchGroup.researchGroupId, {
  //       name: researchGroup.name,
  //       description: researchGroup.description,
  //     })
  //     this.setState({
  //       researchGroups: update(this.state.researchGroups, {
  //         [pos]: { done: { $set: !researchGroup.done } }
  //       })
  //     })
  //   } catch {
  //     alert('ResearchGroup deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const researchGroups = await getResearchGroups(this.props.auth.getIdToken())
      this.setState({
        researchGroups,
        loadingResearchGroups: false
      })
    } catch (e) {
      alert(`Failed to fetch researchGroups: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">RESEARCH GROUPS</Header>

        {this.renderCreateResearchGroupInput()}

        {this.renderResearchGroups()}
      </div>
    )
  }

  renderCreateResearchGroupInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Group name"
            onChange={this.handleNameChange}
          />

        </Grid.Column>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Group description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Button color='green' onClick={() => this.onResearchGroupCreate()}>
            SAVE GROUP
          </Button>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderResearchGroups() {
    if (this.state.loadingResearchGroups) {
      return this.renderLoading()
    }

    return this.renderResearchGroupsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading RESEARCHGROUPs
        </Loader>
      </Grid.Row>
    )
  }

  renderResearchGroupsList() {
    return (
      <Grid padded>
        {this.state.researchGroups.map((researchGroup, pos) => {
          return (
            <Grid.Row key={researchGroup.researchGroupId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onResearchGroupCheck(pos)}
                  checked={researchGroup.done}
                />
              </Grid.Column> */}
              <Grid.Column width={3} verticalAlign="top">
                <h5>{researchGroup.name}</h5>
              </Grid.Column>
              <Grid.Column width={7} floated="right">
                {researchGroup.description}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {researchGroup.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(researchGroup.researchGroupId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onResearchGroupDelete(researchGroup.researchGroupId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {researchGroup.attachmentUrl && (
                <Image src={researchGroup.attachmentUrl} onError={(event: { target: { style: { display: string } } }) => event.target.style.display = 'none'} alt=" This is task image!" size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
