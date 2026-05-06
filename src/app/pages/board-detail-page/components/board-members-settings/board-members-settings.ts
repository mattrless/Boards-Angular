import { Component } from '@angular/core';
import { AddBoardMemberForm } from "../add-board-member-form/add-board-member-form";
import { HlmCardImports } from '@spartan-ng/helm/card';
import { BoardMembersDataTable } from "../board-members-data-table/board-members-data-table";

@Component({
  selector: 'board-members-settings',
  imports: [AddBoardMemberForm, HlmCardImports, BoardMembersDataTable],
  templateUrl: './board-members-settings.html',
})
export class BoardMembersSettings {}
