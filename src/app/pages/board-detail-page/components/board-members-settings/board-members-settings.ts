import { Component } from '@angular/core';
import { AddBoardMemberForm } from "../add-board-member-form/add-board-member-form";

@Component({
  selector: 'board-members-settings',
  imports: [AddBoardMemberForm],
  templateUrl: './board-members-settings.html',
})
export class BoardMembersSettings {}
