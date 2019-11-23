import { Component, OnInit } from '@angular/core';
import { Question, Language, Topic } from 'src/app/models';
import { ApiService, DataService } from 'src/app/services';
import { Router } from '@angular/router';
import { dataReStructure, DEFAULT_ADMIN_ROUTE } from 'src/app/Utility';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  languagesQuestions: Language[] = [];
  allQuestions: Question[] = [];
  languagesList: Topic[] = [];
  selectedLanguage = '';
  selectedLanguageQuestions: Question[] = [];

  constructor(
    private api: ApiService,
    private data: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.languagesList = this.data.getLanguagesCollection();
    if (this.languagesList && this.languagesList.length === 0) {
      this.api.getLanguagesCollection().then((languagesCollection: Topic[]) => {
        this.data.setLanguagesCollection(languagesCollection);
        this.languagesList = languagesCollection;
        this.getQuestion();
      }).catch(error => console.log(error));
    } else {
      this.getQuestion();
    }
  }

  getQuestion() {
    this.api.getAllQuestions().then((questionsList: Question[]) => {
      if (questionsList && questionsList.length > 0) {
        this.allQuestions = questionsList;
        this.languagesQuestions = dataReStructure(
          questionsList,
          this.languagesList
        );
        this.onLanguageSelect(this.languagesQuestions[0]);
      }
    }).catch(error => console.log(error));
  }

  onLanguageSelect(language: Language) {
    this.selectedLanguage = language.Id;
    this.selectedLanguageQuestions = language.Questions;
  }

  onEditQuestion(questionId: string) {
    this.data.onEditQuestion.next(questionId);
    this.router.navigate([`${DEFAULT_ADMIN_ROUTE}data-entry/edit`]);
  }
}
